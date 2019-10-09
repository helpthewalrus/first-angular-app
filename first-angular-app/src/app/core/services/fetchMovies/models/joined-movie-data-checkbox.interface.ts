import { MovieCastData } from "./movie-cast-data.interface";

export interface JoinedMovieDataCheckbox {
    isAddedToWatchList: boolean;
    id: number;
    overview: string;
    poster: string;
    releaseDate: string;
    title: string;
    addInfo: Array<MovieCastData>;
}
