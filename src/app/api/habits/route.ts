import { NextResponse } from 'next/server';
import { z } from 'zod';

const createHabitSchema = z.object({
    name: z.string().min(1, "Name is required"),
    cadenceJson: z.any(),
    reminderTime: z.string().optional(),
    color: z.string().optional(),
});


export async function GET() {
    // This is a mock implementation. In a real app, this would fetch from a database.
    const mockHabits = [
        { id: 'h1', userId: 'user1', name: 'Morning Run', color: '#34D399', logs: [{id:'l1', date: new Date().toISOString(), completed: true}] },
        { id: 'h2', userId: 'user1', name: 'Read 20 pages', color: '#60A5FA', logs: [] },
        { id: 'h3', userId: 'user1', name: 'Meditate 10 mins', color: '#FBBF24', logs: [] },
    ];
    
    return NextResponse.json(mockHabits);
}


export async function POST(request: Request) {
    try {
        const json = await request.json();
        const validation = createHabitSchema.safeParse(json);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const newHabit = {
            id: `h${Math.floor(Math.random() * 1000)}`,
            ...validation.data,
            userId: "user1",
            logs: []
        };
        console.log("Creating new habit (mock):", newHabit);

        return NextResponse.json(newHabit, { status: 201 });
    } catch (error) {
        console.error('Error creating habit:', error);
        return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
    }
}
