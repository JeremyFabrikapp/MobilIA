import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis Mobil-IA, votre assistant pour faciliter vos déplacements. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
    },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessages = [
      ...messages,
      { id: Date.now(), text, isBot: false },
      {
        id: Date.now() + 1,
        text: "Je comprends votre demande. Je suis là pour vous aider avec vos déplacements. Que souhaitez-vous savoir spécifiquement ?",
        isBot: true,
      },
    ];
    setMessages(newMessages);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div 
        className="h-[calc(100vh-16rem)] overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Conversation"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}