export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  colorId?: string;
}

export interface HabitLog {
    id: string;
    date: string;
    completed: boolean;
}

export interface Habit {
    id: string;
    name: string;
    color?: string | null;
    logs: HabitLog[];
}

export type PlannerAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE';

export interface PlannerDiff {
    action: PlannerAction;
    event: Partial<CalendarEvent>;
    originalEventId?: string;
    summary: string;
}
