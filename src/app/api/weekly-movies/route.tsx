import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export async function GET() {
  // get list startDate for listId=1
  const startRows = await db.select({ startDate: movie_tables.startDate })
    .from(movie_tables)
    .where(eq(movie_tables.listId, 1))
    .limit(1);

  const startDate = startRows[0]?.startDate;
  const now = new Date();

  // if we know the start date, determine weekNo and return currentWeek movies if present
  let weekNo: number | undefined;
  if (startDate && startDate instanceof Date) {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    weekNo = Math.floor((now.getTime() - startDate.getTime()) / msPerWeek) + 1;
    if (weekNo < 1) return new Response(JSON.stringify([]), { status: 200 });

    const currentWeekMovies = await db.select()
      .from(movie_tables)
      .where(and(eq(movie_tables.listId, 1), eq(movie_tables.currentWeek, weekNo)));

    if (currentWeekMovies.length) {
      return new Response(JSON.stringify(currentWeekMovies), { status: 200 });
    }
  }

  // fetch unwatched movies in listId=1
  const unwatched = await db.select()
    .from(movie_tables)
    .where(and(eq(movie_tables.listId, 1), eq(movie_tables.watched, false)));

  // group by userNm
  type MovieRow = NonNullable<typeof unwatched[number]>;
  const groups = unwatched.reduce<Record<string, MovieRow[]>>((acc, m) => {
    const user = m.userNm ?? 'unknown';
    (acc[user] ||= []).push(m as MovieRow);
    return acc;
  }, {});

  const users = Object.keys(groups);
  if (users.length < 2) return new Response(JSON.stringify([]), { status: 200 });

  // pick movies fairly: everyone gets 1 before anyone gets a 2nd
  const desired = 2; // number of movies to select this week

  // count already-assigned (watched) movies per user (only for users present in groups)
  const assignedRows = await db.select()
    .from(movie_tables)
    .where(and(eq(movie_tables.listId, 1), eq(movie_tables.watched, true)));

  const assignedCounts = assignedRows.reduce<Record<string, number>>((acc, r) => {
    const u = r.userNm ?? 'unknown';
    acc[u] = (acc[u] ?? 0) + 1;
    return acc;
  }, {});

  // build user entries and sort by assigned count (ascending), randomize ties
  const userEntries = users.map(u => ({ user: u, assigned: assignedCounts[u] ?? 0 }));
  userEntries.sort((a, b) => a.assigned - b.assigned || (Math.random() - 0.5));

  // make shallow copies of available movies per user
  const available: Record<string, MovieRow[]> = Object.fromEntries(
    Object.entries(groups).map(([u, arr]) => [u, arr.slice()])
  );

  const selected: MovieRow[] = [];
  // round-robin picks: each round gives at most one pick per user
  while (selected.length < desired) {
    let pickedThisRound = 0;
    for (const entry of userEntries) {
      if (selected.length >= desired) break;
      const u = entry.user;
      const movies = available[u];
      if (!movies || movies.length === 0) continue;
      // pick a random movie for this user
      const idx = Math.floor(Math.random() * movies.length);
      const movie = movies.splice(idx, 1)[0];
      if (movie) {
        selected.push(movie);
        pickedThisRound++;
      }
    }
    // if no picks were possible this round, break to avoid infinite loop
    if (pickedThisRound === 0) break;
  }

  // mark selected movies as watched and set currentWeek
  const ids = selected
    .map(m => m.movieId)
    .filter((id): id is number => id !== null && id !== undefined);
  if (ids.length) {
    const weekToSet = weekNo ?? 1;
    await db.update(movie_tables)
      .set({ watched: true, currentWeek: weekToSet })
      .where(inArray(movie_tables.movieId, ids));
  }

  return new Response(JSON.stringify(selected), { status: 200 });
}
