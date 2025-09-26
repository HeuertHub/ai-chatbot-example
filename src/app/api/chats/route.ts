import { NextRequest, NextResponse } from "next/server";
import { getChats } from "@/lib/db";

export async function GET() {
    const chats = await getChats();
    return NextResponse.json(chats);
}