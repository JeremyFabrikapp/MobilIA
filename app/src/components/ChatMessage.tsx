import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? 'bg-blue-50' : ''} p-4 rounded-lg`}
         role="listitem"
         aria-label={`${isBot ? 'Assistant' : 'User'} message`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <Bot className="h-8 w-8 text-blue-600" aria-hidden="true" />
        ) : (
          <User className="h-8 w-8 text-gray-600" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}