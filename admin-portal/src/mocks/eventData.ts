import { Event } from '@/types/event';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: '市民祭り',
    description: '年次市民祭り開催。様々な出店や演し物があります。',
    date: new Date('2024-12-15'),
    tags: [
      { id: '1', name: 'イベント', type: 'category', value: 'event' },
      { id: '2', name: '中央地区', type: 'area', value: 'central' }
    ],
    createdAt: new Date('2024-12-05T10:00:00Z')
  },
  {
    id: '2',
    title: '道路交通法改正',
    description: '自転車関連の改正施行について',
    date: new Date('2024-12-20'),
    tags: [
      { id: '3', name: '法改正', type: 'category', value: 'law' },
      { id: '4', name: '全地区', type: 'area', value: 'all' }
    ],
    createdAt: new Date('2024-12-04T15:30:00Z')
  },
  {
    id: '3',
    title: '防災訓練実施',
    description: '天竜地区での防災訓練を実施します',
    date: new Date('2024-12-25'),
    tags: [
      { id: '5', name: 'お知らせ', type: 'category', value: 'news' },
      { id: '6', name: '北部', type: 'area', value: 'tenryu' }
    ],
    createdAt: new Date('2024-12-06T09:00:00Z')
  }
];