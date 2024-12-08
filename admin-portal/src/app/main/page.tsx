"use client";
import { EventList } from "@/components/calendar/EventList";
import { Calendar } from "@/components/calendar/Calendar";
import { useEvents } from "@/hooks/useEvents";
import { MOCK_EVENTS } from "@/mocks/eventData";

export default function MainPage() {
  const { events, eventsByDate, sortOption, setSortOption, filter, setFilter } =
    useEvents(MOCK_EVENTS);

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <EventList
          events={events}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filter={filter}
          onFilterChange={setFilter}
        />
        <Calendar eventsByDate={eventsByDate} />
      </div>
    </main>
  );
}
