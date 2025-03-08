import { FC } from "react";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar,Clock, MapPin } from "lucide-react";

interface DayEventsProps {
  events: Event[];
}

export const DayEvents: FC<DayEventsProps> = ({ events }) => {
  // イベントのカテゴリに基づいてスタイルを返す
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

  // 地区名を取得
  const getAreaName = (areaValue: string) => {
    switch (areaValue) {
      case "all":
        return "全地区";
      case "tenryu":
        return "天竜区";
      case "hamana":
        return "浜名区";
      case "central":
        return "中央区";
      default:
        return "";
    }
  };

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
        この日のイベントはありません
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
        <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <h3 className="font-medium">
          {format(events[0].date, "M月d日（E）", { locale: ja })}のイベント
        </h3>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {events.map((event) => {
          const categoryTag = event.tags.find((tag) => tag.type === "category");
          const areaTag = event.tags.find((tag) => tag.type === "area");

          return (
            <div
              key={event.id}
              className="text-left border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0"
            >
              <div className="flex items-center gap-2 mb-1">
                {categoryTag && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getCategoryStyle(
                      categoryTag.value
                    )}`}
                  >
                    {categoryTag.name}
                  </span>
                )}
                {areaTag && areaTag.value !== "all" && (
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3 mr-0.5" />
                    {getAreaName(areaTag.value)}
                  </div>
                )}
              </div>

              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {event.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                {event.description}
              </p>

              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3 mr-1" />
                {format(event.date, "HH:mm", { locale: ja })}時〜
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
