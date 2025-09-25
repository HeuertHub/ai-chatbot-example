"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Share, ThumbsUp, ThumbsDown, Send, Paperclip, Mic } from "lucide-react";
import { type Message } from "@/lib/types";

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading
}: ChatInterfaceProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              {message.role === "user" ? (
                <>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg border p-4 w-3/4 place-self-end">
                      <p>{message.content}</p>
                    </div>
                  </div>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <>
                  <Avatar>
                    <AvatarFallback className="bg-blue-500">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg border p-4 w-3/4">
                      <p className="mb-4">{message.content}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share className="h-4 w-4" />
                        </Button>
                        <div className="ml-auto flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-2 animate-bounce rounded-full"></div>
                    <div
                      className="bg-muted h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.1s" }}></div>
                    <div
                      className="bg-muted h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-6">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-muted flex items-center gap-2 rounded-lg border p-2">
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