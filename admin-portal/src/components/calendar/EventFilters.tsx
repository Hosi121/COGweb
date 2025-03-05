"use client";
import { FC } from "react";
import { EventFilter, EventCategory, AreaTag } from "@/types/event";
import { Card } from "@/components/ui/Card";

interface EventFiltersProps {
  currentFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

const categories: { value: EventCategory; label: string }[] = [
  { value: "event", label: "イベント" },
  { value: "law", label: "法改正" },
  { value: "news", label: "お知らせ" },
];

const areas: { value: AreaTag; label: string }[] = [
  { value: "all", label: "全地区" },
  { value: "tenryu", label: "天竜" },
  { value: "hamana", label: "浜名" },
  { value: "central", label: "中央" },
];

export const EventFilters: FC<EventFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="space-y-4">
        {/* 種別フィルター */}
        <div>
          <h3 className="text-base font-semibold mb-2 text-slate-800 dark:text-slate-200">
            お知らせの種類
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label }) => (
              <label
                key={value}
                className={`
                  flex items-center px-3 py-2 rounded cursor-pointer
                  border transition-all
                  ${
                    currentFilter.categories?.includes(value)
                      ? "border-orange-500 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800 text-slate-600 dark:text-slate-300"
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 dark:text-orange-500 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded"
                  checked={currentFilter.categories?.includes(value) || false}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...(currentFilter.categories || []), value]
                      : currentFilter.categories?.filter((c) => c !== value);
                    onFilterChange({
                      ...currentFilter,
                      categories: newCategories?.length
                        ? newCategories
                        : undefined,
                    });
                  }}
                />
                <span className="ml-2">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 地区フィルター */}
        <div>
          <h3 className="text-base font-semibold mb-2 text-slate-800 dark:text-slate-200">
            地区
          </h3>
          <div className="flex flex-wrap gap-2">
            {areas.map(({ value, label }) => (
              <label
                key={value}
                className={`
                  flex items-center px-3 py-2 rounded cursor-pointer
                  border transition-all
                  ${
                    currentFilter.areas?.includes(value)
                      ? "border-orange-500 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800 text-slate-600 dark:text-slate-300"
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-600 dark:text-orange-500 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded"
                  checked={currentFilter.areas?.includes(value) || false}
                  onChange={(e) => {
                    const newAreas = e.target.checked
                      ? [...(currentFilter.areas || []), value]
                      : currentFilter.areas?.filter((a) => a !== value);
                    onFilterChange({
                      ...currentFilter,
                      areas: newAreas?.length ? newAreas : undefined,
                    });
                  }}
                />
                <span className="ml-2">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
