import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { getDetailsMovie } from '~/api/tmdb_calls';
import { sql, and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { listId, userNm, movieId, listTitle, listDescription, numCurr } = await request.json();

  if (!listId || !userNm || !movieId || !listTitle || !listDescription) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  try {
    const details = await getDetailsMovie(movieId);
    const { title, overview, poster_path, release_date } = details;

    await db.insert(movie_tables).values({
      listId: Number(listId),
      listTitle,
      listDescription,
      userNm,
      movieId,
      numCurr,
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
