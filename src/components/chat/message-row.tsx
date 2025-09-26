"use client"

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check, ThumbsUp, ThumbsDown, Send, Volume2, Mic } from "lucide-react";
import { type Message } from "@/lib/types";
import { sleep } from "@/lib/sleep";

export default function MessageRow(
  {message, onPlay, onTextSelect} : 
  {
    message?: Message, 
    onPlay: (content:string)=> void, 
    onTextSelect: ()=> void
  }
) {
  const [copied, setCopied] = useState(false);
  const toClipboard = async() => {
    try {
      await navigator.clipboard.writeText(message?.content || '');
      setCopied(true);
      await sleep(2000);
      setCopied(false);
    } catch (err) {
      console.error(err);
    }
  }

  // useEffect(() => {
  //   document.addEventListener("selectionchange", onTextSelect);
  //   // document.addEventListener("mouseup", onTextSelect);
  //   // document.addEventListener("keyup", onTextSelect);

  //   return () => {
  //     document.removeEventListener("selectionchange", onTextSelect);
  //     // document.removeEventListener("mouseup", onTextSelect);
  //     // document.removeEventListener("keyup", onTextSelect);
  //   }
  // }, []);

  if (!message) {
    return (
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
    );
  }

  return (
    message.role === "user" ? (
      <>
        <div className="flex-1">
          <div className="bg-muted rounded-3xl border p-4 w-3/4 place-self-end">
            <p onMouseUp={onTextSelect}>{message.content}</p>
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
          <div className="bg-muted rounded-3xl border p-4 w-3/4">
            <p onMouseUp={onTextSelect} className="mb-4">{message.content}</p>
            <div className="flex justify-end gap-2">
              <Button onClick={toClipboard} variant="ghost" size="sm" className="h-8 w-8 p-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button onClick={() => {onPlay(message.content);}} variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Volume2 className="h-4 w-4" />
              </Button>
              {/* <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ThumbsUp className="h-4 w-4" />
                        </Button>
                    </div> */}
            </div>
          </div>
        </div>
      </>
    )
  )
}