'use client';

import { useEffect, useState, useMemo } from "react";
import type Movie from "./helpers/types";

const poster_path = 'https://image.tmdb.org/t/p/w500';

export function groupBy<T, K extends keyof T>(
    array: T[],
    key: K
  ): Record<string, T[]> {
    return array.reduce((acc, item) => {
      const k = String(item[key]);
      acc[k] = acc[k] ?? [];
      acc[k].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

export default function Movies() {
  const [data, setData] = useState<Movie[]>([]);

  // load once
  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch("/api/movies");
      const json: Movie[] = await res.json();
      setData(json);
    }
    fetchMovie();
  }, []);

  // keep only listId===1
  const filtered = useMemo(() => data.filter(m => m.listId === 1), [data]);

  // group by userNm
  const grouped = useMemo(() => groupBy(filtered, "userNm"), [filtered]);

  return (
    <div className="space-y-8 p-4">
      {Object.entries(grouped).map(([user, movies]) => (
        <section key={user} className="space-y-4">
          <h2 className="text-xl font-semibold">{user}</h2>
          <div className="grid grid-cols-2 gap-4">
            {movies.map(m => (
              <div key={`${m.movieId}-${m.userNm}`} className="flex flex-col items-center">
                <img
                  src={`${poster_path}${m.moviePosterPath}`}
                  alt={`poster of ${m.movieTitle}`}
                  className={`w-48 h-auto object-cover rounded shadow ${m.watched ? "opacity-50" : ""}`}
                />
                <p className="mt-2 text-center">
                  {m.movieTitle}
                  {m.movieReleaseDate
                    ? ` (${m.movieReleaseDate.slice(0, 4)})`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}