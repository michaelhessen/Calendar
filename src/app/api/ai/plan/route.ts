import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PlannerDiff } from '@/types';

const planRequestSchema = z.object({
    currentState: z.object({
        events: z.array(z.any()),
    }),
    intent: z.object({
        cmd: z.string(),
        details: z.any(),
    }),
});

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const validation = planRequestSchema.safeParse(json);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }
        
        const { intent } = validation.data;

        // This is a mock planner. A real implementation would be more complex.
        let diff: PlannerDiff[] = [];
        let summary = "I couldn't generate a plan for that request.";

        if (intent.cmd === 'CREATE_EVENT' && intent.details.summary) {
            diff = [{
                action: 'CREATE',
                event: { summary: intent.details.summary },
                summary: `Create event: "${intent.details.summary}" at the next available slot.`
            }];
            summary = `I've prepared a plan to create the event: "${intent.details.summary}".`;
        } else if (intent.cmd === 'PLAN_TASK' && intent.details.title) {
            diff = [{
                action: 'CREATE',
                event: { summary: `Task: ${intent.details.title}` },
                summary: `Schedule task: "${intent.details.title}" before its deadline.`
            }, {
                action: 'CREATE',
                event: { summary: `Focus block for ${intent.details.title}` },
                summary: `Add a focus block to work on the task.`
            }];
            summary = `I've prepared a plan to schedule the task: "${intent.details.title}".`;
        }

        return NextResponse.json({ diff, summary });

    } catch (error) {
        console.error('Error in /api/ai/plan:', error);
        return NextResponse.json({ error: 'Failed to generate plan due to an internal error.' }, { status: 500 });
    }
}
