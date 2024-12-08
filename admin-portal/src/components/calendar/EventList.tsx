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
  sortOption,
  onSortChange,
  filter,
  onFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryLabel = (category: EventCategory): string =>
    ({
      event: "イベント",
      law: "法改正",
      news: "お知らせ",
    }[category]);

  const getCategoryStyle = (category: EventCategory): string =>
    ({
      event: "bg-blue-100 text-blue-700",
      law: "bg-purple-100 text-purple-700",
      news: "bg-green-100 text-green-700",
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
    <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Bell className="h-5 w-5 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
              お知らせ
            </span>
          </CardTitle>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              value={`${sortOption.key}-${sortOption.order}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split("-") as [
                  SortKey,
                  SortOrder
                ];
                onSortChange({ key, order });
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 flex-grow sm:flex-grow-0"
            >
              <option value="date-asc">日付（昇順）</option>
              <option value="date-desc">日付（降順）</option>
              <option value="createdAt-desc">新着順</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-colors flex-grow sm:flex-grow-0 ${
                showFilters || Object.keys(filter).length
                  ? "bg-orange-100 border-orange-200 text-orange-600"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              絞り込み
            </button>
          </div>
        </div>
        {showFilters && (
          <EventFilters
            currentFilter={filter}
            onFilterChange={onFilterChange}
          />
        )}
      </CardHeader>
      <CardContent>
        {/* PC表示用テーブル */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  種類
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  地区
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  タイトル
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  予定日
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
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
                    className="border-b border-slate-100 hover:bg-slate-50/50"
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
                          <span key={tag.id} className="text-sm text-slate-600">
                            {getAreaLabel(tag.value as AreaTag)}
                          </span>
                        ))}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-slate-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {event.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {format(event.date, "yyyy/MM/dd")}
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
        {/* スマホ表示用カードリスト */}
        <div className="md:hidden space-y-4">
          {events.map((event) => {
            const daysUntil = calculateDaysUntil(event.date);
            const isUpcoming = daysUntil >= 0;

            return (
              <div
                key={event.id}
                className="p-4 rounded-lg bg-white shadow-sm space-y-3"
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
                        className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
                      >
                        {getAreaLabel(tag.value as AreaTag)}
                      </span>
                    ))}
                </div>

                <div>
                  <h3 className="font-medium text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="text-slate-600">
                    {format(event.date, "yyyy/MM/dd")}
                  </div>
                  <div>
                    {isUpcoming ? (
                      <span className="text-orange-600 font-medium">
                        あと{daysUntil}日
                      </span>
                    ) : (
                      <span className="text-slate-500">終了</span>
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
