import { Message } from '@/types/chat';
import { MOCK_RESPONSES, DEFAULT_RESPONSES } from '@/mocks/chatData';
import {v4 as uuidv4} from 'uuid';

export interface ChatService {
  sendMessage: (content: string) => Promise<Message>;
}

class MockChatService implements ChatService {
  async sendMessage(content: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // キーワードに基づいて応答を検索
    const matchedResponse = MOCK_RESPONSES.find(
      mock => mock.keywords.some(keyword => content.includes(keyword))
    );
    
    const responseContent = matchedResponse?.response || 
      DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
    
    return {
      id: uuidv4(),
      content: responseContent,
      sender: 'bot',
      timestamp: new Date(),
    };
  }
}

class ApiChatService implements ChatService {
  async sendMessage(content: string): Promise<Message> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }
}

export const chatService: ChatService = 
  process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' 
    ? new MockChatService()
    : new ApiChatService();