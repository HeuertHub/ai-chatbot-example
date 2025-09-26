import { NextRequest, NextResponse } from "next/server";

export async function GET() {

    return NextResponse.json([
        {
            id: "001",
            value: "Word 1",
            language: "fi",
            times_seen: 70,
            status: "NEW",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "false"
        },
        {
            id: "002",
            value: "Word 2",
            language: "de",
            times_seen: 70,
            status: "NEW",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "true"
        },
        {
            id: "003",
            value: "Word 3",
            language: "ar",
            times_seen: 70,
            status: "LEARNING",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "false"
        },
        {
            id: "004",
            value: "Word 4",
            language: "fr",
            times_seen: 70,
            status: "LEARNING",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "false"
        },
        {
            id: "005",
            value: "Word 5",
            language: "zh",
            times_seen: 70,
            status: "PROFICIENT",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "true"
        },
        {
            id: "006",
            value: "Word 6",
            language: "fi",
            times_seen: 70,
            status: "PROFICIENT",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "false"
        },
        {
            id: "007",
            value: "Word 7",
            language: "ar",
            times_seen: 70,
            status: "MASTERED",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "true"
        },
        {
            id: "008",
            value: "Word 8",
            language: "fi",
            times_seen: 70,
            status: "MASTERED",
            senses: "Sense 1, Sense 2, Sense 3",
            favorite: "false"
        },
    ]);
}