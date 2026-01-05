import { searchMovie } from '~/api/tmdb_calls';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 });
  }

  try {
    const data = await searchMovie(query, 1); // page 1
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), { status: 500 });
  }
}
