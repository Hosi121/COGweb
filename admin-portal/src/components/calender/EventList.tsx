'use client';
import { FC, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Bell, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Event, EventCategory, AreaTag, SortOption, EventFilter, SortKey, SortOrder } from '@/types/event';
import { EventFilters } from './EventFilters';

interface EventListProps {
  initialEvents: Event[];
}

export const EventList: FC<EventListProps> = ({ initialEvents }) => {
  const [sortOption, setSortOption] = useState<SortOption>({ key: 'date', order: 'asc' });
  const [filter, setFilter] = useState<EventFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const calculateDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCategoryLabel = (category: EventCategory): string => ({
    event: 'イベント',
    law: '法改正',
    news: 'お知らせ'
  })[category];

  const getCategoryStyle = (category: EventCategory): string => ({
    event: 'bg-blue-100 text-blue-700',
    law: 'bg-purple-100 text-purple-700',
    news: 'bg-green-100 text-green-700'
  })[category];

  const getAreaLabel = (area: AreaTag): string => ({
    all: '全地区',
    tenryu: '天竜',
    hamana: '浜名',
    central: '中央'
  })[area];

  const filteredEvents = useMemo(() => {
    let result = [...initialEvents];

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
  }, [initialEvents, filter, sortOption]);

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Bell className="h-5 w-5 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
              お知らせ
            </span>
          </CardTitle>
          <div className="flex gap-4">
            <select
              value={`${sortOption.key}-${sortOption.order}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-') as [SortKey, SortOrder];
                setSortOption({ key, order });
              }}
              className="px-3 py-1 rounded-lg border border-slate-200"
            >
              <option value="date-asc">日付（昇順）</option>
              <option value="date-desc">日付（降順）</option>
              <option value="createdAt-desc">新着順</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-1 rounded-lg border transition-colors ${showFilters || Object.keys(filter).length
                  ? 'bg-orange-100 border-orange-200 text-orange-600'
                  : 'border-slate-200 hover:bg-slate-50'
                }`}
            >
              絞り込み
            </button>
          </div>
        </div>
        {showFilters && (
          <EventFilters
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">種類</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">地区</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">タイトル</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">予定日</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">残り日数</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const daysUntil = calculateDaysUntil(event.date);
                const isUpcoming = daysUntil >= 0;
                return (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      {event.tags
                        .filter(tag => tag.type === 'category')
                        .map(tag => (
                          <span key={tag.id} className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${getCategoryStyle(tag.value as EventCategory)}
                          `}>
                            {getCategoryLabel(tag.value as EventCategory)}
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      {event.tags
                        .filter(tag => tag.type === 'area')
                        .map(tag => (
                          <span key={tag.id} className="text-sm text-slate-600">
                            {getAreaLabel(tag.value as AreaTag)}
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-slate-900">{event.title}</div>
                        <div className="text-sm text-slate-500">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {format(event.date, 'yyyy/MM/dd')}
                    </td>
                    <td className="px-4 py-3">
                      {isUpcoming ? (
                        <span className="text-orange-600 font-medium">
                          あと{daysUntil}日
                        </span>
                      ) : (
                        <span className="text-slate-500">終了</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};