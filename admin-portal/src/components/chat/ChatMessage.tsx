import { FC } from 'react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => (
  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`
        max-w-[80%] rounded-2xl px-4 py-2
        ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-br-none'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
        }
      `}
    >
      <p className="text-sm">{message.content}</p>
      <span className="text-xs opacity-70 mt-1 block">
        {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  </div>
);