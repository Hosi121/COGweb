"use client";
import { FC, useRef, useEffect, useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatLoading } from '../ui/ChatLoading';

export const ChatInterface: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { messages, isLoading, error, sendMessage, } = useChat();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mounted]);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* チャットアイコン */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
          aria-label="チャットを開く"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* チャットウィンドウ */}
      {isOpen && (
        <div
          className={`
            fixed sm:relative
            inset-4 sm:inset-auto 
            w-auto sm:w-96 
            h-[calc(100vh-2rem)] sm:h-[600px] 
            bg-white rounded-2xl shadow-xl 
            flex flex-col
          `}
        >
          {/* ヘッダー */}
          <div className="p-4 border-b bg-orange-50 rounded-t-2xl flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-orange-800">市民サポートチャット</h2>
              <p className="text-sm text-orange-600">お気軽にご質問ください</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-orange-100 rounded-lg transition-colors"
              aria-label="チャットを閉じる"
            >
              <X className="w-5 h-5 text-orange-600" />
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <ChatLoading />}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};