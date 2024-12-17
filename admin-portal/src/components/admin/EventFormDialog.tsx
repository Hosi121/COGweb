'use client';

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EventCategory, AreaTag } from '@/types/event';

interface EventFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, date: Date, category: EventCategory, area: AreaTag) => void;
  selectedDate: Date;
}

export const EventFormDialog: FC<EventFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'event' as EventCategory,
    area: 'all' as AreaTag,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      formData.title,
      formData.description,
      selectedDate,
      formData.category,
      formData.area
    );
    setFormData({
      title: '',
      description: '',
      category: 'event',
      area: 'all'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {format(selectedDate, 'yyyy年MM月dd日（E）', { locale: ja })}の予定を追加
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">タイトル</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">説明</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">カテゴリ</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as EventCategory }))}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="event">イベント</option>
                <option value="law">法改正</option>
                <option value="news">お知らせ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">地区</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value as AreaTag }))}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">全地区</option>
                <option value="tenryu">天竜区</option>
                <option value="hamana">浜名区</option>
                <option value="central">中央区</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              追加
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
