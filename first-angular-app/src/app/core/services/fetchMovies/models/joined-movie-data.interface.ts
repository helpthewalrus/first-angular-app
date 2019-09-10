import { MovieCastData } from "./movie-cast-data";

export interface JoinedMovieData {
  movieId: number;
  movieOverview: string;
  moviePoster: string;
  movieReleaseDate: string;
  movieTitle: string;
  moviesAddInfo: Array<MovieCastData>;
}
