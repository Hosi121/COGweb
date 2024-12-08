import { FC } from "react";
import { Event } from "@/types/event";
import { format } from "date-fns";

interface DayEventsProps {
  events: Event[];
}

export const DayEvents: FC<DayEventsProps> = ({ events }) => {
  return (
    <div className="absolute z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-slate-200">
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="text-left">
            <div className="font-medium text-slate-900">{event.title}</div>
            <div className="text-xs text-slate-500">
              {format(event.date, "HH:mm")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
