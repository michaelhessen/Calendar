import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PlannerDiff } from '@/types';

const applyRequestSchema = z.object({
  diff: z.array(z.any()),
});


export async function POST(request: Request) {
    try {
        const json = await request.json();
        const validation = applyRequestSchema.safeParse(json);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const { diff } = validation.data as { diff: PlannerDiff[] };
        
        const results = { created: 0, updated: 0, deleted: 0, errors: [] as string[] };

        for (const item of diff) {
            console.log(`Applying action: ${item.action} for event: ${item.event.summary}`);
            switch (item.action) {
                case 'CREATE':
                    results.created++;
                    break;
                case 'UPDATE':
                case 'MOVE':
                    results.updated++;
                    break;
                case 'DELETE':
                    results.deleted++;
                    break;
            }
        }
        
        return NextResponse.json({ success: true, summary: results });

    } catch (error) {
        console.error('Error in /api/calendar/apply:', error);
        return NextResponse.json({ error: 'Failed to apply changes due to an internal error.' }, { status: 500 });
    }
}
