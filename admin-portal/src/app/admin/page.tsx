import { CsvUploader } from "@/components/admin/CsvUploader";
import { EventCalendarManager } from "@/components/admin/EventCalendarManager";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, Presentation } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        管理者ダッシュボード
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* 発表資料管理 */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Presentation className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              発表資料管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              プロダクト発表資料のアップロードや管理を行えます。
            </p>
            <Link
              href="/admin/presentations"
              className="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              発表資料管理へ
            </Link>
          </CardContent>
        </Card>

        {/* CSVデータ管理 */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              CSVデータ管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              CSV形式のデータをアップロードして情報を一括更新できます。
            </p>
            <div className="mt-4">
              <CsvUploader />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 行事予定管理（既存のコンポーネント） */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
          行事予定カレンダー管理
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          カレンダーの日付をクリックすると、その日のイベントを追加できます。
        </p>
      </div>
      <EventCalendarManager />
    </div>
  );
}
