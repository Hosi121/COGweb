import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface ChatService {
  sendMessage: (content: string) => Promise<Message>;
}

export class ApiChatService implements ChatService {
  async sendMessage(content: string): Promise<Message> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      return {
        id: uuidv4(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }
}

export const chatService = new ApiChatService();