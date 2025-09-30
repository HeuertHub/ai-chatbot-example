import { createClient } from "./supabase-server";
import { entryStatusIcons, PracticeSession, SessionExercise } from "./types";
import { getEntryPrompt } from "@/lib/prompts";
import { openai, defaultModel } from "@/lib/openai";
import { stripJSONFence } from "@/lib/stripJSONFence";
import { type EntryResponse, type Message, type FullEntry } from "@/lib/types";
import { checkServerIdentity } from "tls";

export async function createNewChat({ language, title, preview }: { language: string, title: string, preview: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').insert({
        title: title,
        preview: preview,
        language: language
    }).select('*').single();

    if (error) throw error;

    return data;
}

export async function updateChat({ chat_id, preview }: { chat_id: string, preview: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').update({
        preview: preview
    }).eq('id', chat_id);

    if (error) throw error;

    return data;
}

export async function newUserMessage({ chat_id, content }: { chat_id: string, content: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').insert({
        chat_id,
        role: "user",
        content
    }).select('*').single();

    if (error) throw error;

    return data;
}

export async function messageSent({ id }: { id: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').update({
        sent: true
    }).eq('id', id);

    if (error) throw error;

    return data;
}

export async function newAssistantMessage({ chat_id, content }: { chat_id: string, content: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').insert({
        chat_id,
        role: "assistant",
        content
    }).select('*').single();

    if (error) throw error;

    return data;
}

export async function getChats() {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').select('*').order('timestamp', { ascending: false });

    if (error) throw error;

    return data;
}

export async function getChatMessages({ chat_id }: { chat_id: string | null }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat_id)
        .order('timestamp', { ascending: true });

    if (error) throw error;

    return data;
}

export async function handleExtractedEntries(entries: string[], language: string) {
    for (let entry of entries) {
        try {
            const systemPrompt = getEntryPrompt(language);
            const resp = await openai.chat.completions.create({
                model: defaultModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: entry }
                ],
                response_format: { type: "json_object" },
                temperature: 0
            });

            const rawText = resp.choices?.[0]?.message?.content ?? "";
            const text = stripJSONFence(rawText);

            let json;
            try {
                json = text ? (JSON.parse(text) as EntryResponse) : null;
            } catch (err: unknown) {
                continue;
            }
            if (!json?.isValid) {
                continue;
            }

            // Handle Entry, senses and examples create
            let newEntry = await createEntry({ value: entry, language, senses: json.senses.join(', ') });
            if (json.senses.length > 0) {
                await createSenses({ entry_id: newEntry.id, senses: json.senses });
            }
            if (json.examples.length > 0) {
                await createExamples({ entry_id: newEntry.id, examples: json.examples });
            }
        } catch (err) {
            continue;
        }
    }
}

export async function getDictionary() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('value', { ascending: true });

    if (error) throw error;

    return data;
}

export async function createEntry({ value, language, senses }: { value: string, language: string, senses: string }) {
    const supabase = await createClient();

    const { data: existsData, error: existsError } = await supabase
        .from('entries')
        .select('*')
        .eq('value', value)
        .eq('language', language)
        .maybeSingle();
    if (existsError) throw existsError;

    if (existsData) return existsData;

    const { data, error } = await supabase
        .from('entries')
        .insert({
            value,
            language,
            senses,
            times_seen: 0,
            status: parseTimesSeen(0),
            favorite: false
        }).select('*')
        .single();

    if (error) throw error;

    return data;
}

export async function createSenses({ entry_id, senses }: { entry_id: string, senses: string[] }) {
    const supabase = await createClient();

    const rows = [];
    for (let sense of senses) {
        rows.push({ entry_id, value: sense });
    }

    const { data, error } = await supabase
        .from('senses')
        .insert(rows);

    if (error) throw error;

    return data;
}

export async function createExamples({ entry_id, examples }: { entry_id: string, examples: { value: string, translation: string }[] }) {
    const supabase = await createClient();

    const rows = [];
    for (let example of examples) {
        rows.push({ entry_id, value: example.value, translation: example.translation });
    }

    const { data, error } = await supabase
        .from('examples')
        .insert(rows);

    if (error) throw error;

    return data;
}

function parseTimesSeen(n: number) {
    return entryStatusIcons.find(x => n >= x.min && n <= x.max)?.value || "Error";
}

export async function getSenses({ entry_id }: { entry_id: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('senses')
        .select('*')
        .eq('entry_id', entry_id);

    if (error) throw error;

    return data;
}

export async function getExamples({ entry_id }: { entry_id: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('examples')
        .select('*')
        .eq('entry_id', entry_id);

    if (error) throw error;

    return data;
}

export async function getActivePracticeSession() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_sessions')
        .select(`
            id,
            language,
            score,
            timestamp,
            completed
        `)
        .eq('completed', false)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const { data: exercises, error: errExercises } = await supabase
        .from('session_exercises')
        .select('*')
        .eq('session_id', data.id);
    
    if (errExercises) throw errExercises;

    parseOptions(exercises);

    return {session: data, exercises: exercises};
}

export async function createPracticeSession() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('entries')
        .select(`
            id,
            value,
            language,
            times_seen,
            status,
            senses,
            favorite,
            senses (
                id,
                entry_id,
                value
            ),
            examples (
                id,
                entry_id,
                value,
                translation
            )
        `)
        .order('times_seen', { ascending: true })
        .limit(40);

    if (error) throw error;
    if (!data || data.length < 5) throw "Not enough entries on the dictionary, come back later";
    const exerciseTypes = ['fill-in-blank','word-meaning'];
    const possibleLangauges = [...new Set(data.map(e => e.language))];
    const exercisesPerSession = 20;
    const chosenLanguage = getRandom(possibleLangauges, 1)[0];
    const sessionExercises:SessionExercise[] = [];

    let { data: practiceSession, error: errPracticeSession } = await supabase
    .from('practice_sessions')
    .insert({language: chosenLanguage})
    .select('*')
    .maybeSingle();
    
    if (errPracticeSession) throw errPracticeSession;
    if (!practiceSession) throw "No practice session found";
    
    for(let i = 0; i < exercisesPerSession;) {
        const exerciseType = getRandom(exerciseTypes, 1)[0];
        const chosenEntry = getRandom(data.filter(e => e.language === chosenLanguage), 1)[0];
        let exercise:SessionExercise|null;
        if(exerciseType === 'fill-in-blank') {
            exercise = generateFill(chosenEntry);
            if(!exercise) exercise = generateMeaning(chosenEntry);
        } else {
            exercise = generateMeaning(chosenEntry);
        }

        if(!exercise) continue;

        sessionExercises.push(exercise);
        i++;
    }

    let { data: insertedExercises, error: errInsertedExercises } = await supabase
        .from('session_exercises')
        .insert(sessionExercises)
        .select('*');

    if(errInsertedExercises) throw errInsertedExercises;

    parseOptions(insertedExercises);

    return {session: practiceSession, exercises: insertedExercises};

    function generateFill(entry: FullEntry) {
        const exercise:SessionExercise = {
            session_id: practiceSession.id,
            entry_id: entry.id,
            type: "fill-in-blank",
            prompt: "",
            options: [] as string[],
            explanation: "",
            correct: false,
            completed: false
        };
        let filteredExamples = entry.examples.filter(e => e.value.includes(entry.value));
        if (!filteredExamples || filteredExamples.length === 0) return null;
        const example = getRandom([...filteredExamples], 1)[0];
        if (!example || example.length === 0) return null;


        const blank = '_'.repeat(entry.value.length);
        const regex = new RegExp(`${entry.value}`, 'gi');
        exercise.prompt = example.value.replace(regex, blank);

        if (!exercise.prompt.includes(blank)) return null;
        exercise.options.push(entry.value);

        const otherEntries = data?.filter(e => e.language === entry.language && e.id !== entry.id) || [];
        if (otherEntries.length < 2) return null;
        const otherRandom = getRandom(otherEntries, 2);

        otherRandom.forEach(o => {
            exercise.options.push(o.value);
        });

        exercise.explanation = example.translation;

        return exercise;
    }

    function generateMeaning(entry: FullEntry) {
        let exercise:SessionExercise = {
            session_id: practiceSession.id,
            entry_id: entry.id,
            type: "word-meaning",
            prompt: "",
            options: [] as string[],
            explanation: "",
            correct: false,
            completed: false
        }

        exercise.prompt = entry.value;
        const correctSenses = entry.senses.filter(s => s.entry_id === entry.id);
        const incorrectSenses = [...new Set(data?.filter(e => e.id !== entry.id).flatMap(e => e.senses))];

        if (correctSenses.length === 0 || incorrectSenses.length < 2) return null;

        exercise.options.push(getRandom(correctSenses, 1)[0].value);
        const incorrectSensesRandom = getRandom(incorrectSenses, 2);
        incorrectSensesRandom.forEach(s => {
            exercise.options.push(s.value);
        });

        let filteredExamples = entry.examples.filter(e => e.value.includes(entry.value));
        if (!filteredExamples || filteredExamples.length === 0) return null;
        const example = getRandom([...filteredExamples], 1)[0];
        if (!example || example.length === 0) return null;

        exercise.explanation = example.value;

        return exercise;
    }
}

export async function updateSession(session: PracticeSession) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_sessions')
        .update({score: session.score, completed: session.completed})
        .eq('id', session.id)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateQuestions(questions: SessionExercise[]) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('session_exercises')
        .upsert(questions)
        .select();

    if (error) throw error;

    const entryIdtoTimesSeenMap:any = {};
    questions.forEach(q => {
        if(q.correct) {
            if(!entryIdtoTimesSeenMap[q.entry_id]) {
                entryIdtoTimesSeenMap[q.entry_id] = 0;
            }

            entryIdtoTimesSeenMap[q.entry_id]++;
        }
    });

    if(Object.keys(entryIdtoTimesSeenMap).length === 0) return data;

    const { data: entriesSelect, error: errEntries } = await supabase
        .from('entries')
        .select('*')
        .in('id', Object.keys(entryIdtoTimesSeenMap));
    
    if(errEntries) return errEntries;
    if(!entriesSelect) return data;

    for(let entry of (entriesSelect as any[])) {
        entry.times_seen = entry.times_seen + (entryIdtoTimesSeenMap[entry.id] || 0);
        entry.status = parseTimesSeen(entry.times_seen);
    }

    const { data: entriesUpdate, error: errEntriesUpdate } = await supabase
        .from('entries')
        .upsert(entriesSelect)
        .select('*');
    return data;
}

function getRandom(arr: any[], n: number) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled.slice(0, n);
}


function parseOptions(exercises:any[] | null) {
    if(!exercises) return;
    exercises.forEach(e => {
        e.options = JSON.parse(e.options);
    })
}