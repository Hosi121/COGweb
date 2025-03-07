import { FC, useState } from "react";
import {
  Event,
  EventFilter,
  SortOption,
  EventCategory,
  AreaTag,
  SortKey,
  SortOrder,
} from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { EventFilters } from "./EventFilters";

interface EventListProps {
  events: Event[];
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

export const EventList: FC<EventListProps> = ({
  events,
  filter,
  onFilterChange,
  sortOption,
  onSortChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // フィルターがアクティブかどうかをチェック
  const isFilterActive = Boolean(
    (filter.categories && filter.categories.length > 0) ||
      (filter.areas && filter.areas.length > 0)
  );

  const getCategoryLabel = (category: EventCategory): string =>
    ({
      event: "イベント",
      law: "法改正",
      news: "お知らせ",
    }[category]);

  const getCategoryStyle = (category: EventCategory): string =>
    ({
      event: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      law: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      news: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    }[category]);

  const getAreaLabel = (area: AreaTag): string =>
    ({
      all: "全地区",
      tenryu: "天竜",
      hamana: "浜名",
      central: "中央",
    }[area]);

  const calculateDaysUntil = (date: Date): number => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
              お知らせ
            </span>
          </CardTitle>
          <div className="flex gap-2">
            <select
              value={`${sortOption.key}-${sortOption.order}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split("-") as [
                  SortKey,
                  SortOrder
                ];
                onSortChange({ key, order });
              }}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              <option value="date-asc">日付（昇順）</option>
              <option value="date-desc">日付（降順）</option>
              <option value="createdAt-desc">新着順</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-1 rounded-lg border transition-colors
                ${
                  showFilters || isFilterActive
                    ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
            >
              絞り込み
              {isFilterActive && (
                <span className="ml-1 text-xs bg-orange-600 dark:bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
        {showFilters && (
          <EventFilters
            currentFilter={filter}
            onFilterChange={(newFilter) => {
              onFilterChange(newFilter);
            }}
          />
        )}
      </CardHeader>
      <CardContent>
        {/* PC表示用テーブル */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                  種類
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                  地区
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                  タイトル
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                  予定日
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                  残り日数
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const daysUntil = calculateDaysUntil(event.date);
                const isUpcoming = daysUntil >= 0;
                return (
                  <tr
                    key={event.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-4 py-3">
                      {event.tags
                        .filter((tag) => tag.type === "category")
                        .map((tag) => (
                          <span
                            key={tag.id}
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${getCategoryStyle(tag.value as EventCategory)}
                          `}
                          >
                            {getCategoryLabel(tag.value as EventCategory)}
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      {event.tags
                        .filter((tag) => tag.type === "area")
                        .map((tag) => (
                          <span
                            key={tag.id}
                            className="text-sm text-slate-600 dark:text-slate-300"
                          >
                            {getAreaLabel(tag.value as AreaTag)}
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {event.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                      {format(event.date, "yyyy/MM/dd")}
                    </td>
                    <td className="px-4 py-3">
                      {isUpcoming ? (
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                          あと{daysUntil}日
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">
                          終了
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* スマホ表示用カードリスト */}
        <div className="md:hidden space-y-4">
          {events.map((event) => {
            const daysUntil = calculateDaysUntil(event.date);
            const isUpcoming = daysUntil >= 0;

            return (
              <div
                key={event.id}
                className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap gap-2">
                  {event.tags
                    .filter((tag) => tag.type === "category")
                    .map((tag) => (
                      <span
                        key={tag.id}
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getCategoryStyle(tag.value as EventCategory)}
                      `}
                      >
                        {getCategoryLabel(tag.value as EventCategory)}
                      </span>
                    ))}
                  {event.tags
                    .filter((tag) => tag.type === "area")
                    .map((tag) => (
                      <span
                        key={tag.id}
                        className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full"
                      >
                        {getAreaLabel(tag.value as AreaTag)}
                      </span>
                    ))}
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="text-slate-600 dark:text-slate-300">
                    {format(event.date, "yyyy/MM/dd")}
                  </div>
                  <div>
                    {isUpcoming ? (
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        あと{daysUntil}日
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        終了
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
