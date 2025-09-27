import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

import { ArrowDown, ArrowUp, ChevronsUpDown, Heart, CircleSlash2 } from "lucide-react";

enum EntryStatus {
    NEW = "New",
    INTRODUCED = "Introduced",
    LEARNING = "Learning",
    FAMILIAR = "Familiar",
    PROFICIENT = "Proficient",
    MASTERED = "Mastered",
    RETAINED = "Retained"
}

export const languages:Language[] = [
    {
        value: "de",
        label: "German"
    },
    {
        value: "fi",
        label: "Finnish"
    },
    {
        value: "ru",
        label: "Russian"
    },
    {
        value: "zh",
        label: "Chinese"
    },
    {
        value: "ar",
        label: "Arabic"
    },
    {
        value: "fr",
        label: "French"
    },
    {
        value: "en",
        label: "English"
    },
    {
        value: "it",
        label: "Italian"
    },
    {
        value: "ja",
        label: "Japanese"
    },
    {
        value: "po",
        label: "Polish"
    },
    {
        value: "sv",
        label: "Swedish"
    },
    {
        value: "tr",
        label: "Turkish"
    },
];

export const favoriteOptions = [
    {
        value: "false",
        label: "Unfaved",
        icon: CircleSlash2
    },
    {
        value: "true",
        label: "Faved",
        icon: Heart
    },
];

export const entryStatusIcons = [
    {
        value: "NEW",
        label: "New",
        description: "Not yet studied",
        icon: ArrowDown
    },
    {
        value: "INTRODUCED",
        label: "Introduced",
        description: "First exposure",
        icon: ArrowUp
    },
    {
        value: "LEARNING",
        label: "Learning",
        description: "In active practice",
        icon: ChevronsUpDown
    },
    {
        value: "FAMILIAR",
        label: "Familiar",
        description: "Recognizable with effort",
        icon: ChevronsUpDown
    },
    {
        value: "PROFICIENT",
        label: "Proficient",
        description: "Usually recalled correctly",
        icon: ChevronsUpDown
    },
    {
        value: "MASTERED",
        label: "Mastered",
        description: "Consistently recalled",
        icon: ChevronsUpDown
    },
    {
        value: "RETAINED",
        label: "Retained",
        description: "Long-term stable knowledge",
        icon: ChevronsUpDown
    },
];
/*
New – not yet studied
Introduced – first exposure
Learning – in active practice
Familiar – recognizable with effort
Proficient – usually recalled correctly
Mastered – consistently recalled
Retained – long-term stable knowledge
*/

// ----------------------------------------- API Response Types
export type ChatResponse = {
    response: string,
    extracted_entries: string[],
    title?:string
}
export type EntryResponse = {
    isValid: boolean,
    senses: [],
    examples: {
        value: string,
        translation: string
    }[]
}

//------------------------------------------

export type Language = {
    value: string,
    label: string
}

export type Chat = {
    id: string,
    title: string,
    preview: string,
    timestamp: Timestamp,
    language: string
}

export type Message = {
    id: string,
    chat_id: string,
    role: string,
    content: string,
    timestamp: Timestamp,
    sent: boolean
}

export type Entry = {
    id: string,
    value: string,
    language: string,
    times_seen: number,
    status: EntryStatus,
    senses: string,
    favorite: boolean
}

export type Sense = {
    id: string,
    entry_id: string,
    value: string
}

export type Example = {
    id: string,
    entry_id: string,
    value: string,
    translation: string
}

export type PracticeSession = {
    id: string,
    language: string,
    score: number,
    timestamp: Timestamp
}

export type SessionExercise = {
    id: string,
    session_id: string,
    entry_id: string,
    correct: boolean,
    completed: boolean
}