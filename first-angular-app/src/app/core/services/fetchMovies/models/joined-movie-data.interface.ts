import { MovieCastData } from "./movie-cast-data.interface";

export interface JoinedMovieData {
  id: number;
  overview: string;
  poster: string;
  releaseDate: string;
  title: string;
  addInfo: Array<MovieCastData>;
}
