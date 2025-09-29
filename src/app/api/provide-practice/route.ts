import { NextRequest, NextResponse } from "next/server";
import { getActivePracticeSession, createPracticeSession } from "@/lib/db";

export async function GET(req: NextRequest) {
    const activePracticeSession = await getActivePracticeSession();

    if(!!activePracticeSession && activePracticeSession.length !== 0) return NextResponse.json({ok: true, data: activePracticeSession});

    const newPracticeSession = await createPracticeSession();

    if(!!newPracticeSession) return NextResponse.json({ok: true, data: newPracticeSession});

    return NextResponse.json({ok:false, data: null});
}