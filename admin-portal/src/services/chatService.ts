import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { format, isFuture, isPast, compareAsc } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Event, EventCategory, AreaTag } from '@/types/event';
import chatConfig from '@/prompts/chat.json';

// ヘルパー関数を追加
const getCategoryLabel = (category?: EventCategory): string => {
  switch (category) {
    case 'event': return 'イベント';
    case 'law': return '法改正';
    case 'news': return 'お知らせ';
    default: return 'その他';
  }
};

const getAreaLabel = (area?: AreaTag): string => {
  switch (area) {
    case 'all': return '全地区';
    case 'tenryu': return '天竜';
    case 'hamana': return '浜名';
    case 'central': return '中央';
    default: return '未指定';
  }
};

export interface ChatService {
  sendMessage: (content: string) => Promise<Message>;
}

export class ApiChatService implements ChatService {
  private async generateSystemPrompt(): Promise<string> {
    try {
      const { data: rawEvents, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          tags (*)
        `)
        .order('date', { ascending: true });

      if (eventsError) {
        throw eventsError;
      }

      if (!rawEvents || rawEvents.length === 0) {
        return '申し訳ありませんが、現在イベント情報が登録されていません。一般的な市政に関する質問にはお答えできます。';
      }

      const events: Event[] = rawEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        tags: event.tags,
        createdAt: new Date(event.created_at),
        updatedAt: event.updated_at ? new Date(event.updated_at) : undefined
      }));
      
      const upcomingEvents = events
        .filter(event => isFuture(event.date))
        .sort((a, b) => compareAsc(a.date, b.date))
        .slice(0, 5);

      const recentPastEvents = events
        .filter(event => isPast(event.date))
        .sort((a, b) => compareAsc(b.date, a.date))
        .slice(0, 3);

      // イベント情報をフォーマット
      const formatEvents = (events: Event[]) => {
        if (events.length === 0) return 'なし';

        return events.map(event => {
          const categoryTag = event.tags.find(tag => tag.type === 'category');
          const areaTag = event.tags.find(tag => tag.type === 'area');

          return `
- ${format(new Date(event.date), 'yyyy年MM月dd日', { locale: ja })}
  タイトル: ${event.title}
  説明: ${event.description}
  種別: ${getCategoryLabel(categoryTag?.value as EventCategory)}
  地区: ${getAreaLabel(areaTag?.value as AreaTag)}
          `.trim();
        }).join('\n');
      };

      const formattedUpcoming = formatEvents(upcomingEvents);
      const formattedPast = formatEvents(recentPastEvents);

      // プロンプトの組み立て
      const { systemPromptTemplate } = chatConfig;
      const promptParts = [
        systemPromptTemplate.introduction.replace('{currentDate}',
          format(new Date(), 'yyyy年MM月dd日', { locale: ja })),
        systemPromptTemplate.important,
        systemPromptTemplate.eventSections.upcoming.replace('{upcomingEvents}',
          formattedUpcoming || 'なし'),
        systemPromptTemplate.eventSections.past.replace('{pastEvents}',
          formattedPast || 'なし'),
        '回答の際は以下のガイドラインに従ってください：',
        systemPromptTemplate.guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n'),
        systemPromptTemplate.footer
      ];

      const prompt = promptParts.join('\n\n');
      return prompt;

    } catch (error) {
      throw error;
    }
  }

  async sendMessage(content: string): Promise<Message> {
    try {
      const systemPrompt = await this.generateSystemPrompt();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          systemPrompt,
        }),
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