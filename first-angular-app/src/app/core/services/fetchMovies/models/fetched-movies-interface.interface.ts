import { MovieDataInterface } from "./movie-data-interface.interface";

export interface FetchedMoviesInterface {
  page: number;
  total_results: number;
  total_pages: number;
  results: MovieDataInterface[];
}
