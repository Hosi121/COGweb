import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CalendarIcon } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Event } from '@/types/event';

interface CalendarProps {
  eventsByDate: Map<string, Event[]>;
}

export const Calendar: FC<CalendarProps> = ({ eventsByDate }) => {
  const today = new Date();
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
          {/* 曜日ヘッダー */}
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center text-sm font-bold p-1">
              {day}
            </div>
          ))}

          {/* 日付グリッド */}
          {days.map((day, i) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const events = eventsByDate.get(dateKey) || [];
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <div
                key={i}
                className={`
                  min-h-[80px] p-1 sm:p-2 
                  border rounded-lg
                  ${isToday ? 'border-orange-400 bg-orange-50' : 'border-slate-200'}
                  relative
                `}
              >
                {/* 日付 */}
                <div className={`
                  text-sm font-medium mb-1
                  ${isToday ? 'text-orange-600' : 'text-slate-600'}
                `}>
                  {format(day, 'd')}
                </div>

                {/* イベントリスト */}
                <div className="space-y-1 overflow-hidden">
                  {events.map((event, index) => {
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

                {/* 複数イベントがある場合の表示 */}
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