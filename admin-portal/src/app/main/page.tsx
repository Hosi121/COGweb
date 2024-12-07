import { EventList } from '@/components/calender/EventList';
import { Calendar } from '@/components/calender/Calender';
import { MOCK_EVENTS } from '@/mocks/eventData';

export default function MainPage() {
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <EventList initialEvents={MOCK_EVENTS} />
        <Calendar />
      </div>
    </main>
  );
}