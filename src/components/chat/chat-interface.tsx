"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Share, ThumbsUp, ThumbsDown, Send, Volume2, Mic } from "lucide-react";
import { type Message, type Chat } from "@/lib/types";
import { useState, useEffect } from "react";
import MessageRow from "./message-row";
import { speak, stop, getVoicesByLang, TTSVoice } from "@/lib/tts";

interface ChatInterfaceProps {
  chat: Chat;
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  lang: string;
}

export function ChatInterface({
  chat,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  lang
}: ChatInterfaceProps) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<TTSVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const chatDate = new Date(chat.timestamp).toDateString();

  useEffect(() => {
    getVoicesByLang(lang).then((list) => {
      setVoices(list);
      if (list.length) setSelectedVoice(list[0].voiceURI);
    });
  }, [lang]);
  
  const handleSpeak = (content:string) => {
    if(speaking) {
      stop();
      setSpeaking(false);
    } else if(selectedVoice) {
      speak(content, selectedVoice);
      setSpeaking(true)
    }
  }


  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-6">
        <div className="mx-auto max-w-3xl flex-row">
          <p>{chatDate} • {chat.language}</p>
        </div>
      </div>
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <MessageRow message={message} onPlay={handleSpeak}/>
            </div>
          ))}
          {isLoading && (
            <MessageRow onPlay={handleSpeak}/>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-6">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-secondary flex items-center gap-2 rounded-lg border p-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 p-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}