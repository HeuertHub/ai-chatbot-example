"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { ChatInterface } from "@/components/chat/chat-interface";
import { type Message, type Chat } from "@/lib/types";
import { Loading } from "@/components/misc/loading-screen";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {setInput(e.target.value)};
  const handleSubmit = () => {alert(input)};

  const handleNewChat = () => {
    setSelectedChat(null);
    // Reset chat messages would happen here in a real app
  };

  const handleSelectChat = async (chatId: string) => {
    let currentChat = chats.find(c => {return c.id === chatId}) || null;

    setSelectedChat(currentChat);
    if(!currentChat) {
      return;
    }
    setIsLoading(true);
    const req = await fetch(`/api/messages?id=${currentChat.id}`);
    const res = await req.json();

    setMessages(res);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // In a real app, this would start a new chat with the suggestion
    setSelectedChat(null);
  };

  useEffect(() => {
    
  },[selectedChat]);

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
        selectedChatId={selectedChat?.id || null}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <div className="flex flex-1 flex-col">
        {isLoading ? 
          <Loading/>
          :
          !selectedChat?.id ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <ChatInterface
              chat={selectedChat}
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoadingChat}
              lang={selectedChat.language}
            />
          )
        }
      </div>
    </div>
  );
}
