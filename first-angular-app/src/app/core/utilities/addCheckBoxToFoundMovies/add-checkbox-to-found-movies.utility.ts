import { JoinedMovieData, JoinedMovieDataCheckbox } from "../../services/index";

/**
 * Add isAddedToWatchList property to existing array of found movies
 *
 * @param movies - array of found movies
 * @param filmsToWatchList - array with chosen "to watch" movies
 */
export function addCheckboxToFoundMovies(
    movies: Array<JoinedMovieData>,
    filmsToWatchList: Array<JoinedMovieDataCheckbox>
): Array<JoinedMovieDataCheckbox> {
    return movies.map((movie: JoinedMovieData) => {
        const isAddedToWatchList: boolean = filmsToWatchList.find(
            (item: JoinedMovieDataCheckbox) => item.id === movie.id
        )
            ? true
            : false;
        return {
            ...movie,
            isAddedToWatchList
        };
    });
}
