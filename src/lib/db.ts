import { createClient } from "./supabase-server";
import { entryStatusIcons } from "./types";

export async function createNewChat({language, title, preview}:{language:string, title:string, preview:string}) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').insert({
        title: title,
        preview: preview,
        language: language
    }).select('*').single();

    if(error) throw error;

    return data;
}

export async function updateChat({chat_id, preview}:{chat_id:string, preview: string}) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').update({
        preview: preview
    }).eq('id', chat_id);

    if(error) throw error;

    return data;
}

export async function newUserMessage({chat_id, content}:{chat_id:string, content:string}) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').insert({
        chat_id,
        role: "user",
        content
    }).select('*').single();

    if(error) throw error;
    
    return data;
}

export async function messageSent({id}:{id:string}) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').update({
        sent: true
    }).eq('id', id);

    if(error) throw error;

    return data;
}

export async function newAssistantMessage({chat_id, content}:{chat_id:string, content:string}) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('messages').insert({
        chat_id,
        role: "assistant",
        content
    }).select('*').single();

    if(error) throw error;

    return data;
}

export async function getChats() {
    const supabase = await createClient();

    const { data, error } = await supabase.from('chats').select('*').order('timestamp', {ascending: false});

    if(error) throw error;

    return data;
}

export async function getChatMessages({chat_id}:{chat_id:string | null}) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat_id)
        .order('timestamp', {ascending: true});

    if(error) throw error;

    return data;
}

export async function handleExtractedEntries(entries: string[]) {

}

export async function getDictionary() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('value', {ascending: true});

    if(error) throw error;

    return data;
}

export async function createEntry({value, language, senses}:{value:string, language:string, senses:string}) {
    const supabase = await createClient();

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

        if(error) throw error;

        return data;
}

export async function createSenses({entry_id, senses}:{entry_id:string, senses:string[]}) {
    const supabase = await createClient();

    const rows = [];
    for(let sense of senses) {
        rows.push({entry_id, value:sense});
    }

    const { data, error } = await supabase
        .from('senses')
        .insert(rows);
    
    if(error) throw error;

    return data;
}

export async function createExamples({entry_id, examples}:{entry_id:string, examples:{value:string,translation:string}[]}) {
    const supabase = await createClient();

    const rows = [];
    for(let example of examples) {
        rows.push({entry_id, value: example.value, translation: example.translation});
    }

    const { data, error } = await supabase
        .from('examples')
        .insert(rows);
    
    if(error) throw error;

    return data;
}

function parseTimesSeen(n:number) {
    return entryStatusIcons.find(x => n >= x.min && n <= x.max)?.value || "Error";
}