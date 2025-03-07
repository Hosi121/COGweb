"use client";

import { useState } from "react";
import { usePresentations } from "@/hooks/usePresentations";
import { PresentationType } from "@/types/presentation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Upload,
  FileText,
  Presentation as PresentationIcon,
  Image,
  X,
} from "lucide-react";

export default function PresentationUpload() {
  const { uploadPresentation, isLoading, error } = usePresentations();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PresentationType>("document");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // ファイル名をタイトルにセット（空の場合のみ）
      if (!title) {
        const fileName = selectedFile.name.split(".")[0];
        setTitle(fileName);
      }

      // ファイル種類を自動判別
      const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "";
      if (["ppt", "pptx"].includes(fileExt)) {
        setType("slide");
      } else if (["pdf"].includes(fileExt)) {
        setType("document");
      } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt)) {
        setType("image");
      } else {
        setType("other");
      }
    }
  };

  // サムネイル選択ハンドラー
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);

      // プレビューを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // アップロードハンドラー
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    try {
      setSuccessMessage(null);
      const result = await uploadPresentation(
        file,
        title,
        type,
        description || undefined,
        thumbnailFile || undefined
      );

      // フォームをリセット
      setTitle("");
      setDescription("");
      setType("document");
      setFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);

      // 成功メッセージを表示
      setSuccessMessage(`資料「${result.title}」がアップロードされました`);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
          発表資料のアップロード
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* ファイル選択 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              資料ファイル*
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
              {file ? (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-3 rounded">
                  <div className="flex items-center">
                    {type === "slide" ? (
                      <PresentationIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                    ) : type === "document" ? (
                      <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                    ) : type === "image" ? (
                      <Image className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                    ) : (
                      <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                    )}
                    <span className="text-sm text-slate-800 dark:text-slate-200 truncate max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                  />
                  <Upload className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">
                    クリックして資料をアップロード
                    <br />
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      PDF, PowerPoint, 画像ファイル (JPG, PNG, GIF, WebP)
                    </span>
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* サムネイル選択（オプション） */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              サムネイル画像（任意）
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center">
              {thumbnailPreview ? (
                <div className="space-y-4 w-full">
                  <div className="aspect-video max-w-xs mx-auto bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                    <img
                      src={thumbnailPreview}
                      alt="サムネイルプレビュー"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                    className="text-sm text-red-500 dark:text-red-400 flex items-center mx-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    削除
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <input
                    type="file"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Image className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    クリックしてサムネイル画像を選択
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    PDF資料やスライドの表紙画像などを設定できます
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* タイトルと説明 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              タイトル*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              説明（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              資料タイプ
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PresentationType)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="slide">プレゼンテーション</option>
              <option value="document">ドキュメント</option>
              <option value="image">画像</option>
              <option value="other">その他</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !file || !title}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                アップロード中...
              </span>
            ) : (
              "資料をアップロード"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
