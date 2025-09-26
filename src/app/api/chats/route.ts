import { NextRequest, NextResponse } from "next/server";

export async function GET() {

    return NextResponse.json([
        {
            id: '111',
            title: 'Chat 1',
            preview: 'What did you do about it?',
            timestamp: new Date(),
            language: 'fi'
        },
        {
            id: '222',
            title: 'Crazy Convo',
            preview: 'No, I did not do it',
            timestamp: new Date(),
            language: 'ru'
        },
    ]);
}