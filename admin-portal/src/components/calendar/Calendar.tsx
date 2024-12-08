import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ja } from "date-fns/locale";
import { Event } from "@/types/event";

interface CalendarProps {
  eventsByDate: Map<string, Event[]>;
}

// src/components/calendar/Calendar.tsx
export const Calendar: FC<CalendarProps> = ({ eventsByDate }) => {
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
            {format(today, "yyyy年 MM月", { locale: ja })}
          </h3>
          <p className="text-orange-600 mt-2">
            今日は{format(today, "MM月dd日（E）", { locale: ja })}です。
          </p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
            <div key={day} className="text-center text-sm font-bold p-1">
              {day}
            </div>
          ))}
          {days.map((day, i) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const events = eventsByDate.get(dateKey) || [];
            const isToday =
              format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

            return (
              <div
                key={i}
                className={`
                                    min-h-[100px] p-2 rounded-lg
                                    ${
                                      isToday
                                        ? "bg-orange-50 border-2 border-orange-400"
                                        : events.length > 0
                                        ? "bg-slate-50 border border-slate-200"
                                        : "border border-slate-100"
                                    }
                                `}
              >
                <div
                  className={`
                                    text-sm font-medium mb-1 
                                    ${
                                      isToday
                                        ? "text-orange-600"
                                        : "text-slate-600"
                                    }
                                `}
                >
                  {format(day, "d")}
                </div>
                {events.length > 0 && (
                  <div className="space-y-1">
                    {events.map((event, index) => (
                      <div
                        key={event.id}
                        className={`
                                                    text-xs p-1 rounded
                                                    ${
                                                      index < 2
                                                        ? "block"
                                                        : "hidden md:block"
                                                    }
                                                    ${
                                                      event.tags.find(
                                                        (tag) =>
                                                          tag.type ===
                                                          "category"
                                                      )?.value === "event"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : event.tags.find(
                                                            (tag) =>
                                                              tag.type ===
                                                              "category"
                                                          )?.value === "law"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-green-100 text-green-700"
                                                    }
                                                `}
                      >
                        {event.title}
                        {index === 2 && events.length > 3 && (
                          <span className="text-slate-500 text-xs">
                            他{events.length - 3}件
                          </span>
                        )}
                      </div>
                    ))}
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
