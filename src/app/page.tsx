"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { ChatInterface } from "@/components/chat/chat-interface";
import { type Message } from "@/lib/types";
import { Loading } from "@/components/misc/loading-screen";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {setInput(e.target.value)};
  const handleSubmit = () => {alert(input)};

  const handleNewChat = () => {
    setSelectedChatId(null);
    // Reset chat messages would happen here in a real app
  };

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    setIsLoading(true);
    const req = await fetch(`/api/messages?id=${chatId}`);
    const res = await req.json();

    setMessages(res);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // In a real app, this would start a new chat with the suggestion
    setSelectedChatId("new");
  };

  useEffect(() => {
    async function getChats() {
      const req = await fetch('/api/chats');
      const res = await req.json();

      setChats(res);
    }

    getChats();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <div className="flex flex-1 flex-col">
        {isLoading ? 
          <Loading/>
          :
          !selectedChatId ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatInterface
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoadingChat}
            />
          )
        }
      </div>
    </div>
  );
}
