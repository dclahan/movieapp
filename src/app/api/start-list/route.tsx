// set startDate to now for all movies in listId
import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const listId = body.listId ?? '0';

        const now = new Date();

        await db.update(movie_tables)
            .set({ startDate: now })
            .where(eq(movie_tables.listId, +listId));

        return new Response(JSON.stringify({ message: 'List started successfully' }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
    }
}