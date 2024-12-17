'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Calendar } from '@/components/calendar/Calendar';
import { EventFormDialog } from '@/components/admin/EventFormDialog';

export const EventCalendarManager = () => {
  const { eventsByDate, createEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">行事予定管理</h2>
      <Calendar
        eventsByDate={eventsByDate}
        isAdmin
        onDateClick={(date) => setSelectedDate(date)}
      />
      {selectedDate && (
        <EventFormDialog
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          onSubmit={createEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
