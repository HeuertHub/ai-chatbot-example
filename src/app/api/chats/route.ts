import { NextRequest, NextResponse } from "next/server";

export async function GET() {

    return NextResponse.json([
        {
            id: '1267352713',
            title: 'Chat 1',
            preview: 'What did you do about it?',
            timestamp: new Date(),
            language: 'en-US'
        },
        {
            id: '1262352713',
            title: 'Crazy Convo',
            preview: 'No, I did not do it',
            timestamp: new Date(),
            language: 'ru-RU'
        },
    ]);
}