"use client";

import { useState } from "react";
import { usePresentations } from "@/hooks/usePresentations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Presentation as PresentationIcon,
  Video,
  Download,
  File,
  ExternalLink,
  Clock,
  BookOpen,
  Search,
} from "lucide-react";
import { PresentationType } from "@/types/presentation";
import { format } from "date-fns";

export default function PresentationMaterials() {
  const { presentations, isLoading, error } = usePresentations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<PresentationType | "all">(
    "all"
  );

  // 検索とフィルタリングを適用
  const filteredPresentations = presentations.filter((presentation) => {
    const matchesSearch =
      presentation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      presentation.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false;

    const matchesType =
      selectedType === "all" || presentation.type === selectedType;

    return matchesSearch && matchesType;
  });

  // 資料タイプに応じたアイコンを返す
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "slide":
        return <PresentationIcon className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
        return <BookOpen className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  // 資料タイプの日本語表示
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "slide":
        return "スライド";
      case "video":
        return "動画";
      case "document":
        return "文書";
      default:
        return "その他";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        プロダクト発表資料
      </h1>

      {/* 検索・フィルター */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="資料を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as PresentationType | "all")
            }
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">すべての種類</option>
            <option value="slide">スライド</option>
            <option value="document">文書</option>
            <option value="video">動画</option>
            <option value="other">その他</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
          {error}
        </div>
      ) : filteredPresentations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-slate-500 dark:text-slate-400">
            {searchQuery || selectedType !== "all"
              ? "検索条件に一致する発表資料はありません。"
              : "現在、公開されている発表資料はありません。"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresentations.map((presentation) => (
            <Card
              key={presentation.id}
              className="overflow-hidden flex flex-col h-full dark:bg-slate-800 dark:border-slate-700"
            >
              {presentation.thumbnailUrl && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={presentation.thumbnailUrl}
                    alt={`${presentation.title}のサムネイル`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                    {getTypeIcon(presentation.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                      {presentation.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {format(new Date(presentation.createdAt), "yyyy/MM/dd")}
                      <span className="mx-2">•</span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">
                        {getTypeLabel(presentation.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4 flex-grow">
                {presentation.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {presentation.description}
                  </p>
                )}

                <div className="mt-auto pt-4 flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => window.open(presentation.fileUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    閲覧する
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-center gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = presentation.fileUrl;
                      a.download = presentation.title;
                      a.click();
                    }}
                  >
                    <Download className="w-4 h-4" />
                    ダウンロード
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
