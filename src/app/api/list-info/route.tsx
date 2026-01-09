import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { getDetailsMovie } from '~/api/tmdb_calls';
import { sql, and, eq } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const lists = await db.selectDistinct({
                listId: movie_tables.listId,
                listTitle: movie_tables.listTitle,
                startDate: movie_tables.startDate,
            })
            .from(movie_tables)
            .orderBy(sql`${movie_tables.listId}, ${movie_tables.startDate} DESC`);
            return new Response(JSON.stringify(lists), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
    }
}