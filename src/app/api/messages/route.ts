import { NextRequest, NextResponse } from "next/server";

const messages = [
    {
        id: '1321',
        chat_id: '1267352713',
        role: 'user',
        content: 'Hi this is my first message',
        timestamp: new Date()
    },
    {
        id: '213213',
        chat_id: '1267352713',
        role: 'partner',
        content: 'Then this is my reply!',
        timestamp: new Date()
    },
    {
        id: '21322',
        chat_id: '1262352713',
        role: 'user',
        content: 'Hi this is my first message on the other chat',
        timestamp: new Date()
    },
    {
        id: '22',
        chat_id: '1262352713',
        role: 'partner',
        content: 'Then this is my reply on this very chat!',
        timestamp: new Date()
    },
    {
        id: '223',
        chat_id: '1262352713',
        role: 'user',
        content: 'Ah, cool!',
        timestamp: new Date()
    },
]

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const chat_id = searchParams.get('id');

    return NextResponse.json(messages.filter(x => x.chat_id === chat_id));
}