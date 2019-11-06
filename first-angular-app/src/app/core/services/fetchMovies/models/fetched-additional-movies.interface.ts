import { AdditionalMovieData } from "./additional-movie-data.interface";

export interface FetchedAdditionalMovies {
    page: number;
    total_results: number;
    total_pages: number;
    results: Array<AdditionalMovieData>;
}
