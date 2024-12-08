"use client";
import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText } from "lucide-react";

type UploadType = "calendar" | "statistics" | "";

export const CsvUploader: FC = () => {
  const [uploadType, setUploadType] = useState<UploadType>("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-xl bg-white/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
          <FileText className="h-5 w-5 inline-block mr-2" />
          CSVアップロード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            アップロードするCSVの種類
          </label>
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as UploadType)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
          >
            <option value="">選択してください</option>
            <option value="calendar">カレンダー情報</option>
            <option value="statistics">統計情報</option>
          </select>
        </div>

        {uploadType && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CSVファイル
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
            />
          </div>
        )}

        {file && uploadType && (
          <button
            className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg transition-all"
            onClick={() => {
              console.log(`Uploading ${uploadType} file:`, file.name);
            }}
          >
            アップロード
          </button>
        )}
      </CardContent>
    </Card>
  );
};
