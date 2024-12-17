'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { usePhotos } from '@/hooks/usePhotos';

export default function PhotoPage() {
  const { photos, isLoading } = usePhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // インデックスの安全な更新
  const safeSetIndex = (newIndex: number) => {
    if (photos.length === 0) return;
    const safeIndex = ((newIndex % photos.length) + photos.length) % photos.length;
    setCurrentIndex(safeIndex);
  };

  // 写真の配列が変更された時のインデックス調整
  useEffect(() => {
    if (currentIndex >= photos.length) {
      setCurrentIndex(0);
    }
  }, [photos.length, currentIndex]);

  // 自動再生の制御
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const interval = setInterval(() => {
      safeSetIndex(currentIndex + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, photos.length, currentIndex]);

  // 前の画像
  const previousImage = () => {
    safeSetIndex(currentIndex - 1);
  };

  // 次の画像
  const nextImage = () => {
    safeSetIndex(currentIndex + 1);
  };

  // ローディングまたは写真がない場合
  if (isLoading || photos.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          {isLoading ? 'Loading...' : 'No photos available'}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col relative">
      {/* コントロール */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-4">
        <button
          onClick={previousImage}
          className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-6 h-6" />
              <span>一時停止</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>再生</span>
            </>
          )}
        </button>
        <button
          onClick={nextImage}
          className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* メイン画像 */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={photos[currentIndex].url}
          alt={photos[currentIndex].title || 'スライドショー'}
          className="max-w-full max-h-[calc(100vh-8rem)] object-contain"
        />
      </div>

      {/* 写真情報のオーバーレイ */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
        <h2 className="text-xl font-bold mb-1">
          {photos[currentIndex].title || '無題'}
        </h2>
        <p className="text-sm opacity-80">
          {new Date(photos[currentIndex].created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}