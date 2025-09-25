import { UUID } from "crypto"
import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type Message = {
    id: UUID,
    chat_id: UUID,
    role: string,
    content: string,
    timestamp: Timestamp
}

export type Chat = {
    id: UUID,
    title: string,
    preview: string,
    timestamp: Timestamp,
    language: string
}