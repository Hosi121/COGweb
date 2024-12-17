'use client';

import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CalendarIcon } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Event } from '@/types/event';

interface CalendarProps {
  eventsByDate: Map<string, Event[]>;
  isAdmin?: boolean;
  onDateClick?: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({ eventsByDate, isAdmin = false, onDateClick }) => {
  const [mounted, setMounted] = useState(false);
  const today = new Date();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <CalendarIcon className="h-5 w-5 text-orange-600" />
            <div className="space-y-2">
              <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today)
  });

  return (
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <CalendarIcon className="h-5 w-5 text-orange-600" />
          <div>
            <h2 className="text-xl font-bold">
              {format(today, 'yyyy年 MM月', { locale: ja })}
            </h2>
            <p className="text-sm text-orange-600 mt-1">
              今日は{format(today, 'MM月dd日（E）', { locale: ja })}です。
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center text-sm font-bold p-1">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const events = eventsByDate.get(dateKey) || [];
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <div
                key={i}
                onClick={() => isAdmin && onDateClick?.(day)}
                className={`
                  min-h-[80px] p-1 sm:p-2 
                  border rounded-lg
                  ${isToday ? 'border-orange-400 bg-orange-50' : 'border-slate-200'}
                  relative
                  ${isAdmin ? 'cursor-pointer hover:bg-slate-50' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isToday ? 'text-orange-600' : 'text-slate-600'}
                `}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {events.slice(0, 2).map((event) => {
                    const categoryColor = event.tags.find(tag => tag.type === 'category')?.value;
                    const colorClass = {
                      event: 'text-blue-600',
                      law: 'text-purple-600',
                      news: 'text-green-600'
                    }[categoryColor as string] || 'text-slate-600';

                    return (
                      <div
                        key={event.id}
                        className={`
                          text-xs leading-tight
                          ${colorClass}
                          truncate
                        `}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>

                {events.length > 2 && (
                  <div className="text-xs text-slate-500 absolute bottom-1 right-1">
                    +{events.length - 2}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
