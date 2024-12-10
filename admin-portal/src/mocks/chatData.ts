import { Message } from '@/types/chat';

export const INITIAL_MESSAGE: Message = {
  id: '1',
  content: 'こんにちは！市民情報ポータルへのご質問にお答えします。お気軽にご相談ください。',
  sender: 'bot',
  timestamp: new Date(),
};

export interface MockResponse {
  keywords: string[];
  response: string;
}

export const MOCK_RESPONSES: MockResponse[] = [
  {
    keywords: ['手続き', '申請'],
    response: '手続きについては、市役所の窓口でご案内しております。必要書類などについてもお答えできます。',
  },
  {
    keywords: ['予約', '申込'],
    response: '予約は電話またはウェブサイトから承っております。ご希望の日時をお知らせください。',
  },
  {
    keywords: ['時間', '営業'],
    response: '市役所の開庁時間は平日9時から17時までです。',
  },
];

export const DEFAULT_RESPONSES: string[] = [
  'ご質問ありがとうございます。確認してお答えいたします。',
  '申し訳ありません。詳しい内容を担当部署に確認させていただきます。',
  'お問い合わせの件について、もう少し具体的に教えていただけますか？',
  'はい、承知いたしました。他にご不明な点はございますか？',
];