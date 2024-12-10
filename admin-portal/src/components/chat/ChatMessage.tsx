import { FC } from 'react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`
        max-w-[80%] p-3 rounded-2xl
        ${message.sender === 'user' 
          ? 'bg-orange-600 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }
      `}
    >
      <p className="text-sm">{message.content}</p>
      <span className="text-xs opacity-70 mt-1 block">
        {message.timestamp.toLocaleTimeString()}
      </span>
    </div>
  </div>
);