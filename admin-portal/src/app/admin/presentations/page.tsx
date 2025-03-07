"use client";

import { useState } from "react";
import { usePresentations } from "@/hooks/usePresentations";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Presentation as PresentationType } from "@/types/presentation";
import {
  FileText,
  Presentation,
  Image,
  Trash2,
  Plus,
  Search,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import PresentationUpload from "@/components/admin/PresentationUpload";

export default function AdminPresentationsPage() {
  const { presentations, isLoading, error, deletePresentation } =
    usePresentations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // 資料タイプに応じたアイコンを返す
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "slide":
        return <Presentation className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // 資料タイプの日本語表示
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "slide":
        return "スライド";
      case "image":
        return "画像";
      case "document":
        return "文書";
      default:
        return "その他";
    }
  };

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

  // 資料削除ハンドラー
  const handleDelete = async (presentation: PresentationType) => {
    if (
      window.confirm(`「${presentation.title}」を削除してもよろしいですか？`)
    ) {
      try {
        // 削除処理を実行
        await deletePresentation(presentation.id);

        // 成功メッセージを表示
        alert(`「${presentation.title}」を削除しました`);
      } catch (err) {
        console.error("Failed to delete presentation:", err);
        // エラーメッセージを表示
        alert(`削除に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
      }
    }
  };

  if (showUploadForm) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowUploadForm(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            資料一覧に戻る
          </Button>
        </div>
        <PresentationUpload />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          発表資料管理
        </h1>
        <Button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          新規アップロード
        </Button>
      </div>

      <Link
        href="/admin"
        className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>管理者ダッシュボードに戻る</span>
      </Link>

      {/* 検索・フィルター */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="資料を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500 focus:outline-none w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="all">すべての種類</option>
            <option value="slide">スライド</option>
            <option value="document">文書</option>
            <option value="image">画像</option>
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
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center text-slate-600 dark:text-slate-400">
            {searchQuery || selectedType !== "all"
              ? "検索条件に一致する発表資料はありません。"
              : "発表資料がありません。「新規アップロード」ボタンから資料を追加してください。"}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  種類
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  タイトル
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  アップロード日
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPresentations.map((presentation) => (
                <tr
                  key={presentation.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                        {getTypeIcon(presentation.type)}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {getTypeLabel(presentation.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {presentation.title}
                      </div>
                      {presentation.description && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">
                          {presentation.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                    {format(
                      new Date(presentation.createdAt),
                      "yyyy/MM/dd HH:mm"
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <a
                        href={presentation.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="ファイルを開く"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(presentation)}
                        className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 市民ポータル側の資料ページへのリンク */}
      <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
              一般公開用の発表資料ページ
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              ここで管理している発表資料は市民ポータルの資料ページで公開されます。
            </p>
            <div className="mt-3">
              <Link
                href="/main/presentations"
                className="inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
              >
                <span>資料ページを確認する</span>
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
