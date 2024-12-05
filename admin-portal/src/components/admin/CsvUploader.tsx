'use client';

import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { FileText, Upload } from 'lucide-react';

export const CsvUploader: FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;
        // モック実装のため実際のアップロード処理は省略
        console.log('Uploading:', file.name);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-orange-700">
                    <FileText className="h-5 w-5" />
                    CSVアップロード
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <label className="block p-4 border-2 border-dashed rounded-lg hover:bg-orange-50 cursor-pointer">
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-6 w-6 text-orange-600" />
                            <span className="text-sm text-gray-600">
                                {file ? file.name : 'CSVファイルを選択してください'}
                            </span>
                        </div>
                    </label>
                    {file && (
                        <button
                            onClick={handleUpload}
                            className="w-full p-2 text-white bg-orange-600 rounded hover:bg-orange-700"
                        >
                            アップロード
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};