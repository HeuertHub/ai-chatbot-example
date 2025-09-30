"use server"

import { NextRequest, NextResponse } from "next/server";
import { openai, defaultModel } from "@/lib/openai";
import { getChatPrompt } from "@/lib/prompts";
import { stripJSONFence } from "@/lib/stripJSONFence";
import { type ChatResponse, type Message } from "@/lib/types";
import { updateSession, updateQuestions } from "@/lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const { session, questions } = body;
        await updateSession(session);
        await updateQuestions(questions);

        return NextResponse.json({ok:true, data: null});
    } catch(err) {
        return NextResponse.json({ok:false, data:null, message: (err as Error).message});
    }
}