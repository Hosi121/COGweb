import { CsvUploader } from '@/components/admin/CsvUploader';
import { EventCalendarManager } from '@/components/admin/EventCalendarManager';

export default function AdminPage() {
  return (
    <div className="p-8">
      <CsvUploader />
      <EventCalendarManager/>
    </div>
  );
}