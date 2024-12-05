import { EventList } from '@/components/calender/EventList';
import { Calendar } from '@/components/calender/Calender';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <EventList />
        <Calendar />
      </div>
    </main>
  );
}