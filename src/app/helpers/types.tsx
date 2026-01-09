export interface Movie {
  hkey: number;
  listTitle: string;
  listId: number;
  listDescription: string;
  movieId: number;
  movieTitle: string;
  movieOverview: string;
  moviePosterPath: string;
  movieReleaseDate: string;
  userNm: string;
  watched: boolean;
}
export interface ListInfo {
  listId: number;
  listTitle: string;
  startDate: string;
}