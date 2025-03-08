"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { ja } from "date-fns/locale";
import { Event } from "@/types/event";
import { Button } from "../ui/Button";

interface CalendarProps {
  eventsByDate: Map<string, Event[]>;
  isAdmin?: boolean;
  onDateClick?: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({
  eventsByDate,
  isAdmin = false,
  onDateClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 日付選択時の処理
  const handleDateSelection = (dateKey: string, date: Date) => {
    if (isAdmin && onDateClick) {
      onDateClick(date);
      return;
    }
    
    const events = eventsByDate.get(dateKey) || [];
    if (events.length > 0) {
      setSelectedDateKey(dateKey);
      setShowModal(true);
    }
  };

  // モーダルを閉じる処理
  const closeModal = () => {
    setShowModal(false);
    setSelectedDateKey(null);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  if (!mounted) {
    return (
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <div className="space-y-2">
              <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const today = new Date();

  // 選択中の日付のイベント
  const selectedEvents = selectedDateKey 
    ? (eventsByDate.get(selectedDateKey) || [])
    : [];

  return (
    <div className="relative">
      <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {format(currentMonth, "yyyy年 MM月", { locale: ja })}
                  </h2>
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    {format(new Date(), "本日は M月d日（E）", { locale: ja })}
                  </span>
                </div>
                <button
                  onClick={goToCurrentMonth}
                  className="text-sm text-orange-600 dark:text-orange-400 mt-1 hover:underline"
                >
                  今月に戻る
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{format(subMonths(currentMonth, 1), "M月", { locale: ja })}</span>
              </button>
              <button
                onClick={goToNextMonth}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span>{format(addMonths(currentMonth, 1), "M月", { locale: ja })}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-bold p-1 text-slate-700 dark:text-slate-300"
              >
                {day}
              </div>
            ))}

            {/* 月の最初の日の前に空白を追加 */}
            {Array.from({ length: days[0].getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[80px]" />
            ))}

            {days.map((day, i) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const events = eventsByDate.get(dateKey) || [];
              const isToday =
                format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const hasEvents = events.length > 0;

              return (
                <div
                  key={i}
                  onClick={() => hasEvents && handleDateSelection(dateKey, day)}
                  className={`
                    min-h-[80px] p-1 sm:p-2 
                    border rounded-lg
                    ${isToday
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600/50"
                      : "border-slate-200 dark:border-slate-700 dark:bg-slate-800/80"
                    }
                    ${selectedDateKey === dateKey && showModal
                      ? "ring-2 ring-orange-500 dark:ring-orange-400" 
                      : ""
                    }
                    relative
                    ${(isAdmin || hasEvents)
                      ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      : ""
                    }
                    ${hasEvents ? "hover:shadow-md transition-shadow" : ""}
                  `}
                >
                  <div
                    className={`
                      text-sm font-medium mb-1
                      ${isToday
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-slate-600 dark:text-slate-300"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {events.slice(0, 2).map((event) => {
                      const categoryColor = event.tags.find(
                        (tag) => tag.type === "category"
                      )?.value;
                      const colorClass =
                        {
                          event: "text-blue-600 dark:text-blue-400",
                          law: "text-purple-600 dark:text-purple-400",
                          news: "text-green-600 dark:text-green-400",
                        }[categoryColor as string] ||
                        "text-slate-600 dark:text-slate-300";

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
                    <div className="text-xs text-slate-500 dark:text-slate-400 absolute bottom-1 right-1">
                      +{events.length - 2}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* イベント詳細モーダルウィンドウ */}
      {showModal && selectedDateKey && selectedEvents.length > 0 && (
        <>
          {/* モーダルオーバーレイ（背景を暗くする） */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* モーダルウィンドウ */}
          <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[80vh] overflow-hidden flex flex-col">
              {/* モーダルヘッダー */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span>
                    {format(new Date(selectedDateKey), "yyyy年MM月dd日（E）", { locale: ja })}のイベント
                  </span>
                </h3>
              </div>
              
              {/* モーダル本文（スクロール可能） */}
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700">
                  {selectedEvents.map(event => {
                    const categoryTag = event.tags.find(tag => tag.type === "category");
                    const areaTag = event.tags.find(tag => tag.type === "area");
                    
                    const getCategoryStyle = (categoryValue: string) => {
                      switch (categoryValue) {
                        case "event":
                          return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
                        case "law":
                          return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
                        case "news":
                          return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
                        default:
                          return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
                      }
                    };

                    const getAreaName = (areaValue: string) => {
                      switch (areaValue) {
                        case "all": return "全地区";
                        case "tenryu": return "天竜区";
                        case "hamana": return "浜名区";
                        case "central": return "中央区";
                        default: return "";
                      }
                    };
                    
                    return (
                      <div key={event.id} className="py-4 first:pt-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {categoryTag && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryStyle(categoryTag.value)}`}>
                              {categoryTag.name}
                            </span>
                          )}
                          {areaTag && areaTag.value !== "all" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {getAreaName(areaTag.value)}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {event.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* モーダルフッター（閉じるボタン） */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  閉じる
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};