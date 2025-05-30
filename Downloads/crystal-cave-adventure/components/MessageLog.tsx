
import React, { useEffect, useRef } from 'react';
import { GameMessage } from '../types';

interface MessageLogProps {
  messages: GameMessage[];
}

export const MessageLog: React.FC<MessageLogProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageColor = (type: GameMessage['type']): string => {
    switch (type) {
      case 'location':
        return 'text-cyan-400 font-semibold';
      case 'narration':
        return 'text-gray-300 italic';
      case 'info':
        return 'text-gray-100';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'system':
        return 'text-yellow-400';
      case 'item':
        return 'text-purple-300';
      case 'energy':
        return 'text-blue-400'; // For energy updates
      default:
        return 'text-gray-100';
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-gray-800">
      {messages.map((msg) => (
        <div key={msg.id} className={`${getMessageColor(msg.type)} whitespace-pre-wrap`}>
          {msg.text}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
