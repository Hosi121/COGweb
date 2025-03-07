export type PresentationType = 'slide' | 'document' | 'image' | 'other';

export interface Presentation {
  id: string;
  title: string;
  description?: string | null;
  type: PresentationType;
  fileUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}