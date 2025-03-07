'use client';

import { useState, useEffect, useMemo } from 'react';
import { Event, EventFilter, SortOption, AreaTag, EventCategory } from '@/types/event';
import { EventService } from '@/services/eventService';
import { utcToZonedTime, format as tzFormat } from 'date-fns-tz';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>({ key: 'date', order: 'asc' });
  const [filter, setFilter] = useState<EventFilter>({});

  // イベントデータの取得
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await EventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("イベントの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 初回レンダリング時にデータ取得
  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (
    title: string,
    description: string,
    date: Date,
    category: EventCategory,
    area: AreaTag
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newEvent = await EventService.createEvent(
        title,
        description,
        date,
        category,
        area
      );
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error("Failed to create event:", err);
      setError("イベントの作成に失敗しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await EventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError("イベントの削除に失敗しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    error,
    sortOption,
    setSortOption,
    filter,
    setFilter,
    fetchEvents,
    createEvent,
    deleteEvent
  };
}