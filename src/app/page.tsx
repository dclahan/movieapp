import Link from "next/link";
import { db } from "~/server/db";
import { getTrendingMovies } from "~/api/tmdb_calls";
// import { listItems, movieLists, movies } from "~/server/db/schema";
import { sql } from "drizzle-orm";

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

function groupBy(data: any[], key: string) {
  return data.reduce(
    (acc, cur) => {
      acc[cur[key]] = acc[cur[key]] || []; 
      // if the key is new, initiate its value to an array, otherwise keep its own array value
      acc[cur[key]].push(cur);
      return acc;
    }
    , [])
  }

async function Movies() {
  const listswithMovies = [{"listTitle": "Test List", "listId": 1, "listDescription": "A test list", "movieID": 1, "movieTitle": "Test Movie1 ", "moviePosterPath": "/tIh8spVpYapjGjC21e0aK09VlY5.jpg", "movieReleaseDate": "2023-01-01", "userID": 1, "userName": "testuser", "watched": false},
    {"listTitle": "Test List", "listId": 1, "listDescription": "A test list", "movieID": 2, "movieTitle": "Test Movie 2", "moviePosterPath": "/tIh8spVpYapjGjC21e0aK09VlY5.jpg", "movieReleaseDate": "2024-01-01", "userID": 2, "userName": "testuser2", "watched": false},
    {"listTitle": "Test List", "listId": 1, "listDescription": "A test list", "movieID": 3, "movieTitle": "Test Movie 3", "moviePosterPath": "/tIh8spVpYapjGjC21e0aK09VlY5.jpg", "movieReleaseDate": "2025-01-01", "userID": 3, "userName": "testuser3", "watched": true}];
  
  const moviesInLists = groupBy(listswithMovies, "listId");

  return (
    moviesInLists.map((listObject: any[]) => (
      <div key={listObject[0].listId} className=" flex p-2 flex-col w-500 gap-2">
        <div className="flex flex-row gap-2">
         <div>{listObject[0].listTitle}:</div>
         <div>{listObject[0].listDescription}</div>
         </div>
         <div key={listObject[0].listId} className=" flex p-2 flex-row w-500 gap-4">
          {listObject.map(movie => (
            <div key={movie.movieId} className=" flex w-48 p-2 flex-col gap-2">
            <img src={`${process.env.TMDB_IMG_URL}${movie.moviePosterPath}`} alt={`movie ${movie.movieTitle}`} className={movie.watched ? "opacity-50" : ""}/>
            <div>{movie.movieTitle} {movie.movieReleaseDate? `(${movie.movieReleaseDate.substring(0,4)})`: ""}</div>
            </div>
          ))}
        </div>
      </div>
    ))
  );
}



export default async function HomePage() {
  return (
    <main className="">
        <Movies />
        {/* <APITester /> */}
    </main>
  );
}