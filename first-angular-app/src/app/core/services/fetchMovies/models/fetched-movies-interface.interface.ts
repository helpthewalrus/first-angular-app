import { MovieData } from "./movie-data-interface.interface";

export interface FetchedMovies {
  page: number;
  total_results: number;
  total_pages: number;
  results: MovieData[];
}
