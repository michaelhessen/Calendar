"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  events?: { date: Date }[];
}

const Calendar = ({ selectedDate, onDateSelect, events = [] }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDates = events.map(e => e.date.setHours(0,0,0,0));

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7 ml-2" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 mt-2">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.getTime() === today.getTime();
          const isSelected = selectedDate && d.getTime() === selectedDate.setHours(0, 0, 0, 0);
          const hasEvent = eventDates.includes(d.getTime());
          
          return (
            <div key={i} className="py-1 flex justify-center">
              <button
                onClick={() => onDateSelect?.(d)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center relative",
                  "transition-colors",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  !isSelected && "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "bg-accent text-accent-foreground",
                )}
              >
                {d.getDate()}
                {hasEvent && <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"></span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
