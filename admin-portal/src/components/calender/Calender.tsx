import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

export const Calendar: FC = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <CalendarIcon className="h-5 w-5 text-orange-600" />
          <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
            行事カレンダー
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">
            {format(today, 'yyyy年 MM月', { locale: ja })}
          </h3>
          <p className="text-orange-600 mt-2">
            今日は{format(today, 'MM月dd日（E）', { locale: ja })}です。
          </p>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {days.map((day, i) => (
            <div 
              key={i} 
              className={`
                p-4 rounded-xl text-center transition-all
                ${format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                  ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold shadow-lg'
                  : 'hover:bg-slate-50'}
              `}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    );
};