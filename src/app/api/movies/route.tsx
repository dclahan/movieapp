import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const listId = url.searchParams.get('listId') ?? '0';

    const movies = await db.select().from(movie_tables).where(eq(movie_tables.listId, +listId));
    return new Response(JSON.stringify(movies), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
  }
}