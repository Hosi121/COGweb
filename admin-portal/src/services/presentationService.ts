// src/services/presentationService.ts
import { supabase } from "@/lib/supabase";
import { Presentation, PresentationType } from "@/types/presentation";

// データベース行の型定義
interface PresentationDBRow {
  id: string;
  title: string;
  description: string | null;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export class PresentationService {
  /**
   * すべての発表資料を取得する
   */
  static async getPresentations(): Promise<Presentation[]> {
    try {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // データベースのカラム名と型定義のプロパティ名が異なるため変換が必要
      const presentations: Presentation[] = (data || []).map(
        (item: PresentationDBRow) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type as PresentationType,
          fileUrl: item.file_url,
          thumbnailUrl: item.thumbnail_url,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })
      );

      return presentations;
    } catch (error) {
      console.error("Failed to fetch presentations:", error);
      throw error;
    }
  }

  /**
   * IDで発表資料を取得する
   */
  static async getPresentationById(id: string): Promise<Presentation | null> {
    try {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (!data) return null;

      const item = data as PresentationDBRow;

      // データ変換
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type as PresentationType,
        fileUrl: item.file_url,
        thumbnailUrl: item.thumbnail_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (error) {
      console.error("Failed to fetch presentation:", error);
      throw error;
    }
  }

  /**
   * 発表資料を追加する（管理者用）
   */
  static async addPresentation(
    presentation: Omit<Presentation, "id" | "createdAt">
  ): Promise<Presentation> {
    try {
      const { data, error } = await supabase
        .from("presentations")
        .insert([
          {
            title: presentation.title,
            description: presentation.description,
            type: presentation.type,
            file_url: presentation.fileUrl,
            thumbnail_url: presentation.thumbnailUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const item = data as PresentationDBRow;

      // データ変換
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type as PresentationType,
        fileUrl: item.file_url,
        thumbnailUrl: item.thumbnail_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (error) {
      console.error("Failed to add presentation:", error);
      throw error;
    }
  }

  /**
   * 発表資料を更新する（管理者用）
   */
  static async updatePresentation(
    id: string,
    updates: Partial<Omit<Presentation, "id" | "createdAt">>
  ): Promise<void> {
    try {
      interface UpdateData {
        title?: string;
        description?: string | null;
        type?: PresentationType;
        file_url?: string;
        thumbnail_url?: string | null;
        updated_at: string;
      }

      const updateData: UpdateData = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.type) updateData.type = updates.type;
      if (updates.fileUrl) updateData.file_url = updates.fileUrl;
      if (updates.thumbnailUrl !== undefined)
        updateData.thumbnail_url = updates.thumbnailUrl;

      const { error } = await supabase
        .from("presentations")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to update presentation:", error);
      throw error;
    }
  }

  /**
   * 発表資料を削除する（管理者用）
   */
  static async deletePresentation(id: string): Promise<void> {
    try {
      // まず関連するファイル情報を取得
      const presentation = await this.getPresentationById(id);
      if (!presentation) {
        throw new Error("Presentation not found");
      }

      console.log("File URL to delete:", presentation.fileUrl);
      
      // ストレージからファイルを削除
      const filePathMatch = presentation.fileUrl.match(/\/presentations\/(.+)/);
      console.log("File path match:", filePathMatch);
      
      if (filePathMatch && filePathMatch[1]) {
        const filePath = filePathMatch[1];
        console.log("Attempting to delete file at path:", filePath);
        
        const { error: fileDeleteError } = await supabase.storage
          .from("presentations")
          .remove([filePath]);
        
        if (fileDeleteError) {
          console.error("Failed to delete file:", fileDeleteError);
        } else {
          console.log("File deleted successfully");
        }
      }

      // サムネイルがある場合は削除
      if (presentation.thumbnailUrl) {
        const thumbnailPathMatch = presentation.thumbnailUrl.match(/presentations\/(.+)/);
        if (thumbnailPathMatch && thumbnailPathMatch[1]) {
          const thumbnailPath = thumbnailPathMatch[1];
          const { error: thumbnailDeleteError } = await supabase.storage
            .from("presentations")
            .remove([thumbnailPath]);
          
          if (thumbnailDeleteError) {
            console.error("Failed to delete thumbnail:", thumbnailDeleteError);
          }
        }
      }

      // データベースからレコードを削除
      console.log("Attempting to delete database record with ID:", id);
      const { error, data } = await supabase
        .from("presentations")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete response:", data);
      
      if (error) {
        console.error("Database delete error:", error);
        throw error;
      } else {
        console.log("Database record deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete presentation:", error);
      throw error;
    }
  }

  /**
   * ファイルをストレージにアップロードする（管理者用）
   */
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      // presentationsバケットにアップロード
      const { error } = await supabase.storage
        .from('presentations')
        .upload(path, file);
        
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('presentations')
        .getPublicUrl(path);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  /**
   * ストレージからURLのパスを抽出するヘルパーメソッド
   */
  private static extractPathFromUrl(url: string, bucketName: string): string | null {
    const regex = new RegExp(`${bucketName}/(.+)`);
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}