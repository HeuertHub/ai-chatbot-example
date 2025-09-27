import { NextRequest, NextResponse } from "next/server";
import { getDictionary } from "@/lib/db";

export async function GET() {
    const rows = await getDictionary();

    return NextResponse.json({ok: true, data: rows});
}