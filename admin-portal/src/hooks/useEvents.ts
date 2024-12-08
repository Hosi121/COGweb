import { useState, useMemo } from 'react';
import { Event, EventFilter, SortOption, AreaTag, EventCategory } from '@/types/event';

export function useEvents(initialEvents: Event[]) {
  const [sortOption, setSortOption] = useState<SortOption>({ key: 'date', order: 'asc' });
  const [filter, setFilter] = useState<EventFilter>({});

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...initialEvents];
    
    // フィルタリング
    if (filter.categories?.length) {
      result = result.filter(event => 
        event.tags.some(tag => 
          tag.type === 'category' && filter.categories?.includes(tag.value as EventCategory)
        )
      );
    }

    if (filter.areas?.length) {
      result = result.filter(event => 
        event.tags.some(tag => 
          tag.type === 'area' && filter.areas?.includes(tag.value as AreaTag)
        )
      );
    }

    // ソート
    return result.sort((a, b) => {
      switch (sortOption.key) {
        case 'date':
          return sortOption.order === 'asc' 
            ? a.date.getTime() - b.date.getTime()
            : b.date.getTime() - a.date.getTime();
        case 'createdAt':
          return sortOption.order === 'asc'
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  }, [initialEvents, filter, sortOption]);

  // 日付でグループ化されたイベント（カレンダー用）
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    filteredAndSortedEvents.forEach(event => {
      const dateKey = event.date.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });
    return grouped;
  }, [filteredAndSortedEvents]);

  return {
    events: filteredAndSortedEvents,
    eventsByDate,
    sortOption,
    setSortOption,
    filter,
    setFilter,
  };
}