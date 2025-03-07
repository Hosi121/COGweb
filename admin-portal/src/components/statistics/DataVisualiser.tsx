"use client";

import { FC, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BarChart as BarChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MOCK_DATA = [
  { month: "4月", value: 2400, category: "申請件数" },
  { month: "5月", value: 1398, category: "申請件数" },
  { month: "6月", value: 9800, category: "申請件数" },
  { month: "7月", value: 3908, category: "申請件数" },
  { month: "8月", value: 4800, category: "申請件数" },
  { month: "9月", value: 3800, category: "申請件数" },
];

export const DataVisualizer: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ダークモードかどうかを検出
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    // 初期チェック
    checkDarkMode();

    // MutationObserverでdocumentElementのclassListの変化を監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-orange-700 dark:text-orange-400">
          <BarChartIcon className="h-5 w-5" />
          統計情報
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#475569" : "#e2e8f0"}
              />
              <XAxis
                dataKey="month"
                stroke={isDarkMode ? "#cbd5e1" : "#475569"}
                tick={{ fill: isDarkMode ? "#cbd5e1" : "#475569" }}
              />
              <YAxis
                stroke={isDarkMode ? "#cbd5e1" : "#475569"}
                tick={{ fill: isDarkMode ? "#cbd5e1" : "#475569" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  color: isDarkMode ? "#cbd5e1" : "#1e293b",
                  border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                }}
                labelStyle={{
                  color: isDarkMode ? "#e2e8f0" : "#1e293b",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: isDarkMode ? "#cbd5e1" : "#1e293b",
                }}
              />
              <Bar
                dataKey="value"
                name="件数"
                fill={isDarkMode ? "#f97316" : "#f97316"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
