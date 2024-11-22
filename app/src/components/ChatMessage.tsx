import React, { useState } from 'react';
import { Bot, User } from 'lucide-react';
import { ItineraryView } from './AccessibilityInterfaces/ItineraryView';
import { Journey } from '../api/directions';

interface ChatMessageProps {
  message: string;
  journey?: Journey;
  isBot: boolean;
}

export function ChatMessage({ message, journey, isBot }: ChatMessageProps) {
  const [showItinerary, setShowItinerary] = useState(false);

  return (
    <>
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
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{message}</p>
          {journey && (
             <ItineraryView 
             inline
             journey={journey} 
             onClose={() => setShowItinerary(false)} 
           />
            // <button
            //   onClick={() => setShowItinerary(true)}
            //   className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            // >
            //   Voir l'itinéraire
            // </button>
          )}
        </div>
      </div>
      {showItinerary && journey && (
        <ItineraryView 
          journey={journey} 
          onClose={() => setShowItinerary(false)} 
        />
      )}
    </>
  );
}