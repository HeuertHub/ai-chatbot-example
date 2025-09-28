"use server"

import { NextRequest, NextResponse } from "next/server";
import { openai, defaultModel } from "@/lib/openai";
import { getChatPrompt } from "@/lib/prompts";
import { stripJSONFence } from "@/lib/stripJSONFence";
import { type ChatResponse, type Message } from "@/lib/types";
import { createNewChat, newUserMessage, newAssistantMessage, handleExtractedEntries, messageSent } from "@/lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    let dbMessage:Message;
    let newResponse:Message;
    try {
        const { newMessage, language, history } = body;
        const historyResponse = [];
        dbMessage = !!newMessage ? await newUserMessage({chat_id: newMessage.chat_id, content: newMessage.content}) : history.pop();
        for(let row of history) {
            historyResponse.push({role: row.role, content: row.content});
        }

        const systemPrompt = getChatPrompt(language, false);
        const resp = await openai.chat.completions.create({
            model: defaultModel,
            messages: [
                { role: "system", content: systemPrompt },
                ...historyResponse,
                { role: "user", content: dbMessage.content }
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
        if(!json?.response) {
            throw "Empty response";
        }

        console.log(json.extracted_entries);

        void handleExtractedEntries(json?.extracted_entries || [], language).catch(err => console.error(err.message));
        await messageSent({id: dbMessage.id});
        newResponse = await newAssistantMessage({chat_id: dbMessage.chat_id, content: json.response});
    } catch(err) {
        return NextResponse.json({ ok: false, data: null, message: (err as Error).message });
    }    

    return NextResponse.json({
        ok: true,
        data: {
            message: dbMessage,
            response: newResponse
        }
    });
}