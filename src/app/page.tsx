import Link from "next/link";
import { db } from "~/server/db";
import { getTrendingMovies } from "~/api/tmdb_calls";
import { movie_tables } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import Movies from "./movies";
import ThisWeeksMovie from "./currMovies";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <main className="">
        <ThisWeeksMovie />
        <Movies />
    </main>
  );
}