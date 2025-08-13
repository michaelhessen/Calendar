import CalendarView from "@/components/calendar-view";
import ChatPanel from "@/components/chat-panel";
import HabitsPanel from "@/components/habits-panel";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <main className="flex-1 flex flex-col border-r border-border">
        <header className="p-4 border-b border-border flex items-center justify-between h-16 flex-shrink-0">
          <h1 className="text-xl font-semibold">Calendar</h1>
        </header>
        <div className="flex-1 p-4 overflow-y-auto">
          <CalendarView />
        </div>
      </main>

      <aside className="w-[400px] flex flex-col">
        <div className="flex-1 flex flex-col min-h-0 h-[60%]">
           <ChatPanel />
        </div>
        <div className="flex-1 border-t border-border flex flex-col min-h-0 h-[40%]">
          <HabitsPanel />
        </div>
      </aside>
    </div>
  );
}
