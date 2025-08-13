"use client";

import React, { useState, useEffect } from 'react';
import Calendar from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@/types';

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', summary: 'Team Sync', start: { dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), timeZone: 'UTC' }, end: { dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), timeZone: 'UTC' } },
  { id: '2', summary: 'Project Deadline', start: { dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), timeZone: 'UTC' }, end: { dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), timeZone: 'UTC' } },
  { id: '3', summary: '1:1 with Manager', start: { dateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), timeZone: 'UTC' }, end: { dateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), timeZone: 'UTC' } },
];

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // In a real app, you would fetch events from `/api/calendar/events`
    // For now, we use mock data.
    setEvents(MOCK_EVENTS);
  }, []);

  const calendarEvents = events.map(e => ({ date: new Date(e.start.dateTime) }));
  
  const eventsForSelectedDay = events.filter(event => {
    const eventDate = new Date(event.start.dateTime);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="flex gap-4 h-full">
      <Card className="w-[450px] flex-shrink-0">
        <CardContent className="p-0">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            events={calendarEvents}
          />
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsForSelectedDay.length > 0 ? (
            <ul className="space-y-3">
              {eventsForSelectedDay.map(event => (
                <li key={event.id} className="p-3 rounded-lg bg-secondary">
                  <p className="font-semibold">{event.summary}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No events for this day.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
