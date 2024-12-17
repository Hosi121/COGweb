'use client';

import { useState, useMemo } from 'react';
import { Event, EventFilter, SortOption, AreaTag, EventCategory } from '@/types/event';
import { MOCK_EVENTS } from '@/mocks/eventData';
import { v4 as uuidv4 } from 'uuid';
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [sortOption, setSortOption] = useState<SortOption>({ key: 'date', order: 'asc' });
  const [filter, setFilter] = useState<EventFilter>({});

  const createEvent = (
    title: string,
    description: string,
    date: Date,
    category: EventCategory,
    area: AreaTag
  ) => {
    const newEvent: Event = {
      id: uuidv4(),
      title,
      description,
      // 選択した日付をそのまま使用
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      tags: [
        { id: uuidv4(), name: category, type: 'category', value: category },
        { id: uuidv4(), name: area, type: 'area', value: area }
      ],
      createdAt: new Date()
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>) => {
    setEvents(prev => prev.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];
    
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
  }, [events, filter, sortOption]);

  const timeZone = 'Asia/Tokyo';
  
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    filteredAndSortedEvents.forEach(event => {
      const zonedDate = utcToZonedTime(event.date, timeZone);
      const dateKey = tzFormat(zonedDate, 'yyyy-MM-dd', { timeZone });
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
    createEvent,
    updateEvent,
    deleteEvent
  };
}