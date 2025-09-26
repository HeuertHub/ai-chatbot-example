import { UUID } from "crypto";
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
]
/*
New – not yet studied
Introduced – first exposure
Learning – in active practice
Familiar – recognizable with effort
Proficient – usually recalled correctly
Mastered – consistently recalled
Retained – long-term stable knowledge
*/

export type Language = {
    value: string,
    label: string
}

export type Chat = {
    id: UUID,
    title: string,
    preview: string,
    timestamp: Timestamp,
    language: string
}

export type Message = {
    id: UUID,
    chat_id: UUID,
    role: string,
    content: string,
    timestamp: Timestamp
}

export type Entry = {
    id: UUID,
    value: string,
    language: string,
    times_seen: number,
    status: EntryStatus,
    senses: string,
    favorite: boolean
}

export type Sense = {
    id: UUID,
    entry_id: UUID,
    value: string
}

export type Example = {
    id: UUID,
    entry_id: UUID,
    value: string,
    translation: string
}