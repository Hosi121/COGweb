import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { INITIAL_MESSAGE } from '@/mocks/chatData';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await chatService.sendMessage(content);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setError('メッセージの送信に失敗しました');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};