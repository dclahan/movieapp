import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
        const listId = url.searchParams.get('listId')??'0';

        const startRows = await db.select({ listTitle: movie_tables.listTitle })
          .from(movie_tables)
          .where(eq(movie_tables.listId, +listId))
          .limit(1);

        // if no start date, return false
        if (!startRows[0]) {
          return new Response(JSON.stringify({ listTitle: null }), { status: 200 });
        }
        const listTitle = startRows[0].listTitle;
        return new Response(JSON.stringify({ listTitle: listTitle }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
    }
}