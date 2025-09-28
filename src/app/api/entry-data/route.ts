import { NextRequest, NextResponse } from "next/server";
import { getSenses, getExamples } from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const entry_id = searchParams.get('id');

    if(!entry_id) {return NextResponse.json({ok:false, data: "No entry id"})}

    const senses = await getSenses({entry_id});
    const examples = await getExamples({entry_id});

    return NextResponse.json({ok: true, data: {senses, examples}});
}