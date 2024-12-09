import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { INITIAL_MESSAGE } from '@/mocks/chatData';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponse = await chatService.sendMessage(content);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      // エラーハンドリング
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
  };
};