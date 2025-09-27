"use server"

import { NextRequest, NextResponse } from "next/server";
import { openai, defaultModel } from "@/lib/openai";
import { getEntryPrompt } from "@/lib/prompts";
import { stripJSONFence } from "@/lib/stripJSONFence";
import { type EntryResponse, type Message, type Entry } from "@/lib/types";
import { createEntry, createExamples, createSenses } from "@/lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();

    let newEntry:Entry;
    try {
        const { language, entry } = body;

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
            return NextResponse.json({ ok: false, data: null, message: (err as Error).message });
        }
        if(!json?.isValid) {
            throw "Entry not valid or return JSON is empty";
        }

        // Handle Entry, senses and examples create
        newEntry = await createEntry({value: entry, language, senses: json.senses.join(', ')});
        if(json.senses.length > 0) {
            await createSenses({entry_id: newEntry.id, senses: json.senses});
        }
        if(json.examples.length > 0) {
            await createExamples({entry_id: newEntry.id, examples: json.examples});
        }
    } catch(err) {
        return NextResponse.json({ ok: false, data: null, message: (err as Error).message });
    }    

    return NextResponse.json({
        ok: true,
        data: newEntry
    });
}