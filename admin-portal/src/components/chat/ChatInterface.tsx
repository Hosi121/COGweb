"use client";
import { FC, useRef, useEffect, useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatLoading } from '../ui/ChatLoading';
import { Button } from '../ui/Button';

export const ChatInterface: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim()) return;
    
    await sendMessage(inputRef.current.value);
    inputRef.current.value = '';
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-orange-600 to-pink-600 text-white p-0 flex items-center justify-center"
          aria-label="チャットを開く"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <div className="w-[360px] h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col border border-slate-200 dark:border-slate-700">
          {/* ヘッダー */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-t-2xl">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              AIアシスタント
            </h2>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
              aria-label="チャットを閉じる"
            >
              <X className="w-5 h-5" />
              閉じる
            </Button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <ChatLoading />}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 
                         bg-white dark:bg-slate-800 
                         focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 
                         focus:border-transparent outline-none
                         text-slate-900 dark:text-slate-100"
              />
              <Button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white 
                         hover:shadow-lg transition-shadow"
                disabled={isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};