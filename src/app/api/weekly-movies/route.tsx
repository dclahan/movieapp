import { db } from '~/server/db';
import { movie_tables } from '~/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { no } from 'zod/v4/locales';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const listId = url.searchParams.get('listId')??'0';
  // get list startDate for listId=1
  const startRows = await db.select({ startDate: movie_tables.startDate })
    .from(movie_tables)
    .where(eq(movie_tables.listId, +listId))
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
      .where(and(eq(movie_tables.listId, +listId), eq(movie_tables.currentWeek, weekNo)));

    if (currentWeekMovies.length) {
      return new Response(JSON.stringify(currentWeekMovies), { status: 200 });
    }
  }

  // fetch unwatched movies in listId=1
  const unwatched = await db.select()
    .from(movie_tables)
    .where(and(eq(movie_tables.listId, +listId), eq(movie_tables.watched, false)));

  // group by userNm
  type MovieRow = NonNullable<typeof unwatched[number]>;
  const groups = unwatched.reduce<Record<string, MovieRow[]>>((acc, m) => {
    const user = m.userNm ?? 'unknown';
    (acc[user] ||= []).push(m as MovieRow);
    return acc;
  }, {});

  const users = Object.keys(groups);
  // TODO: handle few than 2 users, handle odd number of movies
  if (users.length < 2) return new Response(JSON.stringify([]), { status: 200 });

  // count already-assigned (watched) movies per user (only for users present in groups)
  const assignedRows = await db.select()
    .from(movie_tables)
    .where(and(eq(movie_tables.listId, +listId), eq(movie_tables.watched, true)));

  const assignedCounts = assignedRows.reduce<Record<string, number>>((acc, r) => {
    const u = r.userNm ?? 'unknown';
    acc[u] = (acc[u] ?? 0) + 1;
    return acc;
  }, {});

  const desired = 2; // number of movies to select this week
  const selected: MovieRow[] = [];

  
  const userPriority = users.map(user => ({
    user,
    availableMovies: (groups[user]?.length) ?? 0,
    assignedCount: assignedCounts[user] ?? 0
  }));

  const eligibleUsers = userPriority.filter(u => u.availableMovies > 0);
  
  while (selected.length < desired && eligibleUsers.length > 0) {
    // Step 1: Determine priority group (users with minimum assigned count)
    const minAssigned = Math.min(...eligibleUsers.map(u => u.assignedCount));
    const priorityGroup = eligibleUsers.filter(u => u.assignedCount === minAssigned);

    // Step 2: Randomly select a user from the priority group
    const randomUserIndex = Math.floor(Math.random() * priorityGroup.length);
    const chosenUser = priorityGroup[randomUserIndex]?.user;

    // Step 3: Randomly select a movie from this user's available movies
    const userMovies = groups[chosenUser ?? 'unknown'] ?? [];
    const randomMovieIndex = Math.floor(Math.random() * (userMovies?.length ?? 0));
    const chosenMovie = userMovies?.splice(randomMovieIndex, 1)[0];

    if (chosenMovie) {
      selected.push(chosenMovie);

      // Step 4: Update counts and remove user from eligible if no movies left
      const userIndex = eligibleUsers.findIndex(u => u.user === chosenUser);
      if (eligibleUsers[userIndex] === undefined) break;
      eligibleUsers[userIndex].availableMovies--;
      eligibleUsers[userIndex].assignedCount++;
      
      // Remove user if they have no more movies
      if (eligibleUsers[userIndex]?.availableMovies === 0) {
        eligibleUsers.splice(userIndex, 1);
      }
      
      // Update assignedCounts for future iterations
      assignedCounts[chosenUser ?? 'unknown'] = (assignedCounts[chosenUser ?? 'unknown'] ?? 0) + 1;
    }
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
