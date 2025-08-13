import { NextResponse } from 'next/server';
import { z } from 'zod';

const parseRequestSchema = z.object({
  text: z.string().min(1, "Text input cannot be empty."),
});

// A simple rule-based parser. In a real app, this could be a more sophisticated NLU service.
const parsers = [
    {
        regex: new RegExp('schedule (.*?) for (.*?)$', 'i'),
        handler: (matches: RegExpMatchArray) => ({
            cmd: "CREATE_EVENT",
            details: { summary: matches[1].trim(), timeExpression: matches[2].trim() },
        }),
    },
    {
        regex: new RegExp('plan my task: (.*?), due by (.*?), it will take (.*?)$', 'i'),
        handler: (matches: RegExpMatchArray) => ({
            cmd: "PLAN_TASK",
            details: { title: matches[1].trim(), deadline: matches[2].trim(), duration: matches[3].trim() },
        }),
    },
    {
        regex: new RegExp('block out (.*?) for (.*?) (tomorrow|today|this week)', 'i'),
        handler: (matches: RegExpMatchArray) => ({
            cmd: "CREATE_EVENT",
            details: { summary: `Focus: ${matches[2].trim()}`, duration: matches[1].trim(), timeContext: matches[3].trim() },
        }),
    },
];

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validation = parseRequestSchema.safeParse(json);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
    }

    const { text } = validation.data;

    for (const parser of parsers) {
        const match = text.match(parser.regex);
        if (match) {
            const command = parser.handler(match);
            return NextResponse.json({ command });
        }
    }

    const fallbackCommand = {
      cmd: "UNKNOWN",
      details: { text },
    };

    return NextResponse.json({ command: fallbackCommand }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/ai/parse:', error);
    return NextResponse.json({ error: 'Failed to parse command due to an internal error.' }, { status: 500 });
  }
}
