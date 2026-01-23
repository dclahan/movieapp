import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
        const listId = url.searchParams.get('listId')??'0';

        const startRows = await db.select({ startDate: movie_tables.startDate })
          .from(movie_tables)
          .where(eq(movie_tables.listId, +listId))
          .limit(1);

        // if no start date, return false
        if (!startRows[0]?.startDate) {
          return new Response(JSON.stringify({ started: false, start: null }), { status: 200 });
        }

        const startDate = startRows[0].startDate;
        return new Response(JSON.stringify({ started: true, start: startDate }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
    }
}