'use client';
import { useState, useEffect } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export default function PhotoPage() {
  const { photos, isLoading } = usePhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (photos.length === 0 || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length, isPlaying]);

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (photos.length === 0) {
    return <div>No photos available</div>;
  }

  return (
    <div className="h-screen bg-black flex flex-col relative">
      {/* Controls at top */}
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

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={photos[currentIndex].url}
          alt={photos[currentIndex].title || 'Slideshow'}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Photo details overlay */}
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