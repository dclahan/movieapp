import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';

export async function GET() {
  try {
    const movies = await db.select().from(movie_tables);
    return new Response(JSON.stringify(movies), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
  }
}