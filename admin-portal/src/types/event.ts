export type EventCategory = 'event' | 'law' | 'news';
export type AreaTag = 'all' | 'tenryu' | 'hamana' | 'central';

export type SortKey = 'date' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Tag {
  id: string;
  name: string;
  type: 'area' | 'category';
  value: EventCategory | AreaTag;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  tags: Tag[];
  createdAt: Date;
}

export interface SortOption {
  key: SortKey;
  order: SortOrder;
}

export interface EventFilter {
  categories?: EventCategory[];
  areas?: AreaTag[];
  startDate?: Date;
  endDate?: Date;
}