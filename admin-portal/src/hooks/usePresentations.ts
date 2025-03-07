import { useState, useEffect } from "react";
import { Presentation, PresentationType } from "@/types/presentation";
import { PresentationService } from "@/services/presentationService";
import { v4 as uuidv4 } from "uuid";

export function usePresentations() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 発表資料を取得
  const fetchPresentations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await PresentationService.getPresentations();
      setPresentations(data);
    } catch (err) {
      console.error("Failed to fetch presentations:", err);
      setError("発表資料の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 初回レンダリング時にデータ取得
  useEffect(() => {
    fetchPresentations();
  }, []);

  // ファイルアップロードと発表資料の追加（管理者用）
  const uploadPresentation = async (
    file: File,
    title: string,
    type: PresentationType,
    description?: string,
    thumbnailFile?: File
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // ファイル名の作成
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `files/${fileName}`;

      // メインファイルのアップロード
      const fileUrl = await PresentationService.uploadFile(file, filePath);

      // サムネイルがある場合はアップロード
      let thumbnailUrl = undefined;
      if (thumbnailFile) {
        const thumbnailExt = thumbnailFile.name.split(".").pop();
        const thumbnailName = `${uuidv4()}.${thumbnailExt}`;
        const thumbnailPath = `thumbnails/${thumbnailName}`;
        thumbnailUrl = await PresentationService.uploadFile(
          thumbnailFile,
          thumbnailPath
        );
      }

      // 発表資料データの作成
      const newPresentation = await PresentationService.addPresentation({
        title,
        description,
        type,
        fileUrl,
        thumbnailUrl,
      });

      // 状態を更新
      setPresentations((prev) => [newPresentation, ...prev]);

      return newPresentation;
    } catch (err) {
      console.error("Failed to upload presentation:", err);
      setError("発表資料のアップロードに失敗しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 発表資料の削除（管理者用）
  const deletePresentation = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await PresentationService.deletePresentation(id);
      setPresentations((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete presentation:", err);
      setError("発表資料の削除に失敗しました");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 特定のタイプの発表資料をフィルタリング
  const getPresentationsByType = (type: PresentationType) => {
    return presentations.filter((p) => p.type === type);
  };

  return {
    presentations,
    isLoading,
    error,
    fetchPresentations,
    uploadPresentation,
    deletePresentation,
    getPresentationsByType,
  };
}
