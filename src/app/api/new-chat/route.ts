"use server"

import { NextRequest, NextResponse } from "next/server";
import { openai, defaultModel } from "@/lib/openai";
import { createClient } from "@/lib/supabase-server";
import { getChatPrompt } from "@/lib/prompts";
import { stripJSONFence } from "@/lib/stripJSONFence";
import { type ChatResponse, type Chat } from "@/lib/types";
import { createNewChat, newUserMessage, newAssistantMessage, handleExtractedEntries, messageSent } from "@/lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();

    let newChat:Chat;
    try {
        const { input, language } = body;
        const systemPrompt = getChatPrompt(language, true);
        const resp = await openai.chat.completions.create({
            model: defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: input }
            ],
            response_format: { type: "json_object" },
            temperature: 0.9
        });

        const rawText = resp.choices?.[0]?.message?.content ?? "";
        const text = stripJSONFence(rawText);

        let json;
        try {
            json = text ? (JSON.parse(text) as ChatResponse) : null;
        } catch (err: unknown) {
            return NextResponse.json({ ok: false, data: null, message: (err as Error).message });
        }

        await handleExtractedEntries(json?.extracted_entries || []);

        newChat = await createNewChat({
            language, 
            title: json?.title || 'New chat', 
            preview: json?.response || '...'
        }) as Chat;
        if(!json?.response) {
            throw "Empty response";
        }

        const firstMessage = await newUserMessage({chat_id: newChat.id, content: input});
        
        await messageSent({id: firstMessage.id});
        await newAssistantMessage({chat_id: newChat.id, content: json.response});
    } catch(err) {
        return NextResponse.json({ ok: false, data: null, message: (err as Error).message });
    }    

    return NextResponse.json({
        ok: true,
        data: {
            chat: newChat
        }
    });
}