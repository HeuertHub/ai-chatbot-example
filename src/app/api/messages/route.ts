import { NextRequest, NextResponse } from "next/server";
import { getChatMessages } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get('id');

    const messages = await getChatMessages({chat_id});

    return NextResponse.json({ok: true, data: messages});
}