import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Photo } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async (retryCount = 3) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 写真のURLが有効かチェック
      const validPhotos = await Promise.all(
        (data || []).map(async (photo): Promise<Photo | null> => {
          try {
            const response = await fetch(photo.url, { method: 'HEAD' });
            return response.ok ? photo as Photo : null;
          } catch {
            return null;
          }
        })
      );

      // 無効な写真を除外
      setPhotos(validPhotos.filter((photo): photo is Photo => photo !== null));
    } catch (err) {
      console.error('Fetch error:', err);
      if (retryCount > 0) {
        setTimeout(() => fetchPhotos(retryCount - 1), 1000);
        return;
      }
      setError(err instanceof Error ? err.message : '写真の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadPhoto = async (file: File, title?: string) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const sanitizedName = file.name
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '');
  
      const timestamp = new Date().getTime();
      const filePath = `${uuidv4()}-${timestamp}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

        const { error: dbError } = await supabase
        .from('photos')
        .insert([{
          url: publicUrl,
          storage_key: filePath,
          created_at: new Date().toISOString(),
          title: title || sanitizedName
        }]);

      if (dbError) throw dbError;
      await fetchPhotos();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    isLoading,
    error,
    uploadPhoto,
    refetch: fetchPhotos
  };
}