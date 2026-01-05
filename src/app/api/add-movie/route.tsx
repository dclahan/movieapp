import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { getDetailsMovie } from '~/api/tmdb_calls';
import { sql, and, eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { listId, userNm, movieId } = await request.json();

  if (!listId || !userNm || !movieId) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
  }

  // fetch list data from db, listTitle, listDescription, startDate, and use that to insert new movie
  const listData = await db
    .select({
      listTitle: movie_tables.listTitle,
      listDescription: movie_tables.listDescription,
      startDate: movie_tables.startDate,
    })
    .from(movie_tables)
    .where(eq(movie_tables.listId, Number(listId)))
    .limit(1);

  const row = listData[0];
  if (!row) {
    return new Response(JSON.stringify({ error: 'List not found' }), { status: 404 });
  }

  const { listTitle, listDescription, startDate } = row;

  try {
    const details = await getDetailsMovie(movieId);
    const { title, overview, poster_path, release_date } = details;

    await db.insert(movie_tables).values({
      listId: Number(listId),
      listTitle,
      listDescription,
      startDate,
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
