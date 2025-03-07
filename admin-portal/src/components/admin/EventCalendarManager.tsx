'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Calendar } from '@/components/calendar/Calendar';
import { EventFormDialog } from '@/components/admin/EventFormDialog';
import { Card, CardContent } from '@/components/ui/Card';
import { Trash2 } from 'lucide-react';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const EventCalendarManager = () => {
  const { eventsByDate, createEvent, deleteEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // イベント削除ハンドラー
  const handleDelete = async (event: Event) => {
    if (window.confirm(`「${event.title}」を削除してもよろしいですか？`)) {
      try {
        await deleteEvent(event.id);
        setErrorMessage(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'イベントの削除に失敗しました';
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">行事予定管理</h2>
      
      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      
      {/* カレンダー */}
      <Calendar
        eventsByDate={eventsByDate}
        isAdmin
        onDateClick={(date) => setSelectedDate(date)}
      />

      {/* イベント一覧 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
            登録済みイベント一覧
          </h3>
          <div className="space-y-4">
            {Array.from(eventsByDate.entries()).map(([dateKey, events]) => (
              <div key={dateKey}>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {format(new Date(dateKey), 'yyyy年MM月dd日（E）', { locale: ja })}
                </h4>
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {event.description}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(event)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* イベント追加ダイアログ */}
      {selectedDate && (
        <EventFormDialog
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          onSubmit={createEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
