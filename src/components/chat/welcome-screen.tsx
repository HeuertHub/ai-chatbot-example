"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { languages, type Chat } from "@/lib/types";
import { Label } from "../ui/label";

export function WelcomeScreen({ submitAction }:{ submitAction: (input:string, language:string)=> void}) {
  const [language, setLanguage] = useState<string>(languages[0].value);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async() => {
    await submitAction(input, language);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center p-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-6xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 via-red-500 to-red-600 bg-clip-text text-transparent">
              Welcome
            </span>
          </h1>
          <p className="text-muted-foreground text-xl">What are we talking about today?</p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <Label>Pick a language</Label>
          <Select key="lang-select" value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Pick a voice"/>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => {
                return (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Input Area */}
      <div className="border-t p-6">
        <div className="mx-auto max-w-3xl">
          <form className="relative">
            <div className="bg-secondary flex items-center gap-2 rounded-lg border p-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSubmit}
                type="button"
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