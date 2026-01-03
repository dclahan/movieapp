

const base_url = "https://api.themoviedb.org/3/";
const url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";
const error_base = "Failed to fetch data from ";

async function fetcher(url: string, messageError: string) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer " + process.env.TMDB_API_KEY,
        },
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error(messageError);
    }
    return response.json();
}

export async function getTrendingMovies() {
  return await fetcher(url, error_base + "trending");
}

export async function searchMovie(query: string, indexPage: number) {
    return await fetcher(base_url + `search/movie?query=${query}&include_adult=false&language=en-US&page=${indexPage}`, error_base + "search");
}

export async function getDetailsMovie(id: number) {
    return await fetcher(base_url + `movie/${id}?include_adult=false&language=en-US`, error_base + "details movie");
}
