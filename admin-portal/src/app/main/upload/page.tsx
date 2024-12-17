'use client';
import { useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import { Upload, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const { uploadPhoto, isLoading, error } = usePhotos();
  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');

  const handleFiles = async (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);

      try {
        await uploadPhoto(file, title || file.name);
        setTitle('');
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">写真投稿</h1>
      
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="写真のタイトルを入力"
          className="w-full p-2 border rounded-lg"
        />

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => e.target.files && handleFiles(Array.from(e.target.files))}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600">クリックして写真をアップロード</p>
        </label>
      </div>
    </div>

      {/* プレビュー */}
      {previews.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="aspect-square relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* ローディング */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </main>
  );
}