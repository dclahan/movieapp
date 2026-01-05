import Link from "next/link";
import { db } from "~/server/db";
import { getTrendingMovies } from "~/api/tmdb_calls";
import { movie_tables } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import Movies from "./movies";
import ThisWeeksMovie from "./currMovies";

export const dynamic = 'force-dynamic';

async function APITester() {
  const res = await getTrendingMovies();
  return (
    <div className="flex flex-wrap justify-center gap-4 p-12">
      {res.results.map((movie: any) => (
        <div key={movie.id} className="flex w-48 p-2 flex-col gap-2">
          <img src={`${process.env.TMDB_IMG_URL}${movie.poster_path}`} alt={`movie ${movie.title}`} />
          <div>{movie.title}</div>
        </div>
      ))}
    </div> 
  );
}


export default async function HomePage() {
  return (
    <main className="">
        <ThisWeeksMovie />
        <Movies />
        {/* <APITester /> */}
    </main>
  );
}