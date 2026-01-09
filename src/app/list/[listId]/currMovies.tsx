'use client';
import { useEffect, useState } from "react";
import type Movie from "../../helpers/types";

const posterPath = 'https://image.tmdb.org/t/p/w500';

export default function ThisWeeksMovie({listId}: {listId: string}) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchWeekly() {
      const res = await fetch(`/api/weekly-movies?listId=${listId}`);
      if (!res.ok) throw new Error("Failed to load movies");
      const json: Movie[] = await res.json();
      setMovies(json);
    }
    fetchWeekly();
  }, []);

  return (
    <section key="weekly-movies" className="space-y-4">
      <div className="grid grid-cols-2 gap-4 border-b-2 border-gray-300 pb-4 mb-4">
        {movies.map(movie => (
          <div key={movie.movieId + "-" + movie.userNm} className="flex flex-col items-center gap-4">
            <img 
              src={`${posterPath}${movie.moviePosterPath}`} 
              alt={movie.movieTitle} 
              className="justify-center mx-auto"
            />
            <div className="justify-center text-left font-bold text-2xl">
              <h3>{movie.movieTitle} {movie.movieReleaseDate ? `(${movie.movieReleaseDate.substring(0,4)})` : ""}</h3>
            </div>
            <div className="justify-center text-left italic">
              {movie.userNm}'s pick
            </div>
            <div className="justify-center text-left">
              <a href={`https://letterboxd.com/tmdb/${movie.movieId}`} target="_blank" rel="noopener noreferrer" className="text-white bg-brand box-border border hover:bg-brand-strong  shadow-xs font-medium leading-5 rounded-base text-sm ">Open in LetterBoxd</a>
              <p>{movie.movieOverview}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}