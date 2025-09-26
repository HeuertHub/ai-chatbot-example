"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Share, ThumbsUp, ThumbsDown, Send, X, Mic, BookMarked } from "lucide-react";
import { type Message, type Chat } from "@/lib/types";
import { useState, useEffect } from "react";
import MessageRow from "./message-row";
import { speak, stop, getVoicesByLang, TTSVoice } from "@/lib/tts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languages } from "@/lib/types";

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
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const chatDate = new Date(chat.timestamp).toDateString();
  const currentLanguage = languages.find(x => x.value === chat.language)?.label;

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

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if(selection && selection.toString().length > 0 && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
    }
  }

  const clearTextSelect = () => {
    setSelectedText(null);
  }


  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-6">
        <div className="h-6 mx-auto max-w-3xl flex flex-row items-center justify-between">
          <div>
            { selectedText && 
              <Tooltip>
                <TooltipTrigger onClick={()=>alert(selectedText)}>
                  <BookMarked className="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"/>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col">
                    <X className="h-3 w-3 self-end -top-3 -right-3" onClick={clearTextSelect}></X>
                    Add "{selectedText}" to dictionary
                  </div>
                </TooltipContent>
              </Tooltip>
            }
          </div>
          <div>
            <p>{chat.title} • {chatDate} • {currentLanguage}</p>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <MessageRow message={message} onPlay={handleSpeak} onTextSelect={handleTextSelect}/>
            </div>
          ))}
          {isLoading && (
            <MessageRow onPlay={handleSpeak} onTextSelect={handleTextSelect}/>
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
                placeholder="Type your message..."
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

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  left: '20%',
  transform: 'translateX(-50%)',
  top: '5%',
  width: 56,
  height: 56,
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--fab-bg, rgba(0,0,0,0.75))',
  color: 'white',
  border: 'none',
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  cursor: 'pointer',
  zIndex: 50,
};