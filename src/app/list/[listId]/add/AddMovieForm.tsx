'use client';

import { useState } from 'react';
// import type { MovieResult } from '~/api/tmdb_calls'; // you can add a TS interface if you like

interface AddMovieFormProps {
  listId: string;
}

const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

export default function AddMovieForm({ listId }: AddMovieFormProps) {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    setError('');
    try {
      const res = await fetch(`/list/api/search-movie?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error((await res.json()).error || 'Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAdd = async (movieId: number) => {
    setAddingMovieId(movieId);
    setError('');
    try {
      const res = await fetch('/list/api/add-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, userNm: name, movieId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Add failed');
      setSuccessMsg('Movie added successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingMovieId(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add a Movie to List {listId}</h2>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50`}
          disabled={loadingSearch}
        >
          {loadingSearch ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      {loadingSearch ? (
        <p className="text-gray-500">Loading results…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((movie: any) => (
            <div key={movie.id} className="border rounded p-2 flex flex-col items-center">
              <img
                src={`${posterBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                className="w-32 h-auto mb-2"
              />
              <h3 className="font-semibold">{movie.title}</h3>
              {movie.release_date && <p>({movie.release_date.substring(0, 4)})</p>}
              <button
                onClick={() => handleAdd(movie.id)}
                disabled={addingMovieId === movie.id}
                className={`mt-2 bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50`}
              >
                {addingMovieId === movie.id ? 'Adding…' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
