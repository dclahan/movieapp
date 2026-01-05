'use client';
import { useEffect, useState } from "react";
import type Movie from "./helpers/types";

const posterPath = 'https://image.tmdb.org/t/p/w500';

export default function ThisWeeksMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchWeekly() {
      const res = await fetch("/api/weekly-movies");
      if (!res.ok) throw new Error("Failed to load movies");
      const json: Movie[] = await res.json();
      setMovies(json);
    }
    fetchWeekly();
  }, []);

  return (
    <div className="flex justify-center gap-4">
      {movies.map(movie => (
        <div key={movie.movieId + "-" + movie.userNm} className="flex flex-col justify-center gap-4 border-b-2 border-gray-300">
          <img src={`${posterPath}${movie.moviePosterPath}`} alt={movie.movieTitle} className="justify-center mx-auto"/>
          <div className="justify-center text-left font-bold text-2xl">
            <h3>{movie.movieTitle} {movie.movieReleaseDate ? `(${movie.movieReleaseDate.substring(0,4)})` : ""}</h3>
          </div>
          <div className="justify-center text-left italic">
            {movie.userNm} has selected this week's movie
          </div>
          <div className="justify-center text-left">
            <a href={`https://letterboxd.com/tmdb/${movie.movieId}`} target="_blank" rel="noopener noreferrer">Open in LetterBoxd</a>
            <p>{movie.movieOverview}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
