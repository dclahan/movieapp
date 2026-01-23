'use client';

import { useEffect, useState, useMemo } from "react";
import type {Movie} from "../../helpers/types";

const poster_path = 'https://image.tmdb.org/t/p/w500';

interface ListProps {
  listId: string;
}

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

export default function Movies({ listId }: ListProps) {
  const [data, setData] = useState<Movie[]>([]);

  // load once
  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(`/api/movies?listId=${listId}`);
      const json: Movie[] = await res.json();
      setData(json);
    }
    fetchMovie();
  }, []);

  // display movies with this listId
  const filtered = useMemo(() => data.filter(m => m.listId === +listId), [data]);
  const list_title = filtered[0]?.listTitle || '';

  // group by userNm
  const grouped = useMemo(() => groupBy(filtered, "userNm"), [filtered]);

  return (
    <div className="space-y-8 p-4">
      <div className="text-2xl font-bold">{list_title}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(grouped).map(([user, movies]) => (
            <section key={user} className="space-y-4">
              <h2 className="text-xl font-semibold">{user}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map(m => (
                  <div key={`${m.movieId}-${m.userNm}`} className="flex flex-col items-center">
                    <div className="relative text-center">
                      <img
                        src={`${poster_path}${m.moviePosterPath}`}
                        alt={`poster of ${m.movieTitle}`}
                        className={`w-48 h-auto object-cover rounded shadow ${m.watched ? "opacity-50" : ""}`}
                      />
                      <div className="w-full absolute top-0 left-0 text-center mt-20">
                        <h2 className="text-4xl sm:text-4xl lg:text-2xl font-bold text-gray-200 text-center opacity-50 drop-shadow-lg">
                          { m.watched ? `Week ${m.currentWeek} Pick` : "" }
                        </h2>
                      </div>
                    </div>
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
    </div>
  );
}