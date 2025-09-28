import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

import { Heart, 
    CircleSlash2, 
    CircleDashed, 
    CircleDotDashed, 
    CircleDot, 
    CircleEllipsis, 
    CircleArrowUp,
    CircleCheckBig,
    CircleStar
 } from "lucide-react";

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
        icon: CircleDashed,
        min: 0,
        max: 4
    },
    {
        value: "INTRODUCED",
        label: "Introduced",
        description: "First exposure",
        icon: CircleDotDashed,
        min: 5,
        max: 14
    },
    {
        value: "LEARNING",
        label: "Learning",
        description: "In active practice",
        icon: CircleDot,
        min: 15,
        max: 24
    },
    {
        value: "FAMILIAR",
        label: "Familiar",
        description: "Recognizable with effort",
        icon: CircleEllipsis,
        min: 25,
        max: 34
    },
    {
        value: "PROFICIENT",
        label: "Proficient",
        description: "Usually recalled correctly",
        icon: CircleArrowUp,
        min: 35,
        max: 49
    },
    {
        value: "MASTERED",
        label: "Mastered",
        description: "Consistently recalled",
        icon: CircleCheckBig,
        min: 50,
        max: 69
    },
    {
        value: "RETAINED",
        label: "Retained",
        description: "Long-term stable knowledge",
        icon: CircleStar,
        min: 70,
        max: Infinity
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
    status: string,
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