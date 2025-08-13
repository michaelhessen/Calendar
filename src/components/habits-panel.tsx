"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit } from '@/types';

const MOCK_HABITS: Habit[] = [
    { id: 'h1', name: 'Morning Run', color: '#34D399', logs: [{id:'l1', date: new Date().toISOString(), completed: true}] },
    { id: 'h2', name: 'Read 20 pages', color: '#60A5FA', logs: [] },
    { id: 'h3', name: 'Meditate 10 mins', color: '#FBBF24', logs: [] },
];

const HabitsPanel = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  
  useEffect(() => {
    // In a real app, fetch from `/api/habits`
    setHabits(MOCK_HABITS);
  }, []);

  const todayStr = new Date().toDateString();

  const handleLogHabit = async (habitId: string, completed: boolean) => {
    // In a real app, this would be an API call
    // POST /api/habits/:id/log
    console.log(`Logging habit ${habitId} as ${completed ? 'completed' : 'not completed'}`);
    
    // Optimistic UI update
    setHabits(habits.map(h => {
        if(h.id === habitId) {
            const todayLogIndex = h.logs.findIndex(l => new Date(l.date).toDateString() === todayStr);
            const newLogs = [...h.logs];
            if(completed) {
                if(todayLogIndex === -1) {
                    newLogs.push({id: 'temp', date: new Date().toISOString(), completed: true});
                }
            } else {
                 if(todayLogIndex > -1) {
                    newLogs.splice(todayLogIndex, 1);
                }
            }
            return {...h, logs: newLogs};
        }
        return h;
    }));
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-lg font-semibold text-white mb-4 border-b border-border pb-2 flex-shrink-0">Habits</h2>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {habits.map(habit => {
          const isCompletedToday = habit.logs.some(log => new Date(log.date).toDateString() === todayStr && log.completed);
          return (
            <Card key={habit.id} className={cn("p-3 flex items-center justify-between transition-colors", isCompletedToday ? "bg-secondary/70" : "bg-secondary")}>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: habit.color || '#ffffff' }}></span>
                <p className={cn("font-medium", isCompletedToday && "line-through text-muted-foreground")}>{habit.name}</p>
              </div>
              <button onClick={() => handleLogHabit(habit.id, !isCompletedToday)}>
                <CheckCircle2 className={cn("h-6 w-6 text-muted-foreground hover:text-foreground transition-colors", isCompletedToday && "text-green-400")} />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HabitsPanel;
