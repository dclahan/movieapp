import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { getDetailsMovie } from '~/api/tmdb_calls';
import { sql, and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { listId, userNm, movieId } = await request.json();

  if (!listId || !userNm || !movieId) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  // Optional: limit to 2 movies per user per list
//   const existingCount = await db
//     .select({ count: sql`COUNT(*)` })
//     .from(movie_tables)
//     .where(and(eq(movie_tables.listId, Number(listId)), eq(movie_tables.userNm, userNm)));

//   if (existingCount[0].count >= 2) {
//     return new Response(JSON.stringify({ error: 'You can only add up to 2 movies per list' }), { status: 400 });
//   }

  try {
    const details = await getDetailsMovie(movieId);
    const { title, overview, poster_path, release_date } = details;

    await db.insert(movie_tables).values({
      listId: Number(listId),
      userNm,
      movieId,
      movieTitle: title,
      movieOverview: overview,
      moviePosterPath: poster_path,
      movieReleaseDate: release_date,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
  }
}
