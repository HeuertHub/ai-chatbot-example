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

  const refresh = () => {
    setInput('');
  }

  const handleNewChat = async () => {
    setSelectedChat(null);
    refresh();
  };

  const getChats = async() => {
    const req = await fetch('/api/chats');
    const res = await req.json();

    setChats(res);
  }

  const handleChatSubmitted = async(input:string, language:string) => {
    const req = await fetch('/api/new-chat', {
      method: "POST",
      body: JSON.stringify({input, language}),
      headers: {
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if(!res.ok) {
      alert(res.message);
    }

    setChats([res.data.chat, ...chats]);
    await handleSelectChat(res.data.chat);
  }

  const handleMessageSubmit = async () => {
    if(!selectedChat) {return;}

    const newMessage:Message = {
      chat_id: selectedChat.id,
      content: input,
      role: "user",
      id: 'temp',
      timestamp: new Date().getTime(),
      sent: false
    }

    setMessages([...messages, newMessage]);
    refresh();

    setIsLoadingChat(true);
    const req = await fetch('/api/new-message', {
      method: "POST",
      body: JSON.stringify({newMessage, language: selectedChat?.language, history: messages.slice(-20)}),
      headers: {
        "Content-Type": "application/json"
      },
    });

    setIsLoadingChat(false);
    const res = await req.json();
    if(!res.ok) {
      alert(res.message);
    }

    setMessages([...messages, res.data.newResponse]);
  };

  const handleMessageResubmit = async () => {
    if(!selectedChat) {return;}

    refresh();

    setIsLoadingChat(true);
    const req = await fetch('/api/new-message', {
      method: "POST",
      body: JSON.stringify({language: selectedChat?.language, history: messages.slice(-20)}),
      headers: {
        "Content-Type": "application/json"
      },
    });

    setIsLoadingChat(false);
    const res = await req.json();
    if(!res.ok) {
      alert(res.message);
    }

    setMessages([...messages, res.data.newResponse]);
  };

  const handleSelectChat = async (chat: Chat) => {
    refresh();
    setSelectedChat(chat);
    setIsLoading(true);
    const req = await fetch(`/api/messages?id=${chat.id}`);
    const res = await req.json();

    setMessages(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(selectedChat)
  },[selectedChat]);

  useEffect(() => {
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
            <WelcomeScreen submitAction={handleChatSubmitted} />
          ) : (
            <ChatInterface
              chat={selectedChat}
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleMessageSubmit}
              handleReattempt={handleMessageResubmit}
              isLoading={isLoadingChat}
              lang={selectedChat.language}
            />
          )
        }
      </div>
    </div>
  );
}
