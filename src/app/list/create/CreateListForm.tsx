'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ListInfo } from '~/app/helpers/types';
import { Copy, Check } from 'lucide-react';

const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

export default function CreateListForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [numCurr, setNumCurr] = useState('');
  const [listId, setListId] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
      
  // load once
  useEffect(() => {
    async function fetchListInfoSetNewId() {
      const res = await fetch("/api/list-info");
      const json: ListInfo[] = await res.json();
      const maxListId = json.reduce((maxId, list) => Math.max(maxId, list.listId), 0);
      setListId((maxListId + 1).toString());
    }
    fetchListInfoSetNewId();
    }, []);

  const addLink = `${window.location.origin}/list/${listId}/add`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(addLink);
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = addLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoadingSearch(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/search-movie?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error((await res.json()).error || 'Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleListCreate = async (movieId: number) => {
    setAddingMovieId(movieId);
    setError('');
    try {
      const res = await fetch('/api/create-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, userNm: name, movieId, listTitle, listDescription, numCurr: Number(numCurr) }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Add failed');
      setSuccessMsg('Movie added successfully!');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingMovieId(null);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-600 mb-2">✓ List Created Successfully!</h2>
          <p className="text-lg text-gray-700">Your list "<span className="font-semibold">{listTitle}</span>" is ready!</p>
        </div>


          {/* Share Link Section */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Invite Others to Add Movies</h3>
            <p className="text-gray-600 mb-4">Share this link with your friends so they can add their movies to the list:</p>
            
            {/* Copyable Link Box */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={addLink}
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-gray-50 text-gray-700 font-mono text-sm truncate"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click the link above to select, or use the copy button →
                </p>
              </div>
              
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  copied 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

        <div className="space-y-6">
          {/* View List Button */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Add a movie to <span className="font-semibold">{listTitle}</span></h3>
            {/* <p className="text-gray-600 mb-4">View and manage the movies in your list.</p> */}
            <button
              onClick={() => router.push(`/list/${listId}/add`)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add another movie
            </button>
          </div>

          {/* Instructions */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Share the link above with your friends</li>
              <li>• They can add movies to your list at: <code className="bg-blue-100 px-1 rounded">/list/{listId}/add</code></li>
              <li>• You can always view and manage your list with the "View Your List" button</li>
            </ul>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New List</h2>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="new list title"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <input
          type="text"
          placeholder="new list description"
          value={listDescription}
          onChange={(e) => setListDescription(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <input
          type="text"
          placeholder="# movies picked per week (1 or 2)"
          value={numCurr}
          onChange={(e) => setNumCurr(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <span>Add the first movie!</span>
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
                onClick={() => handleListCreate(movie.id)}
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