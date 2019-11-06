import { AdditionalMovieData, JoinedMovieData, FetchedAdditionalMovies } from "../../index";

/**
 * Create array of objects with combined data about movies and their cast
 *
 * @param moviesInfo - array of objects with fetched data about movies
 */
export function buildMoviesWithChosenInfo(fetchedAdditionalMovies: FetchedAdditionalMovies): Array<JoinedMovieData> {
    return fetchedAdditionalMovies.results.map((movieInfo: AdditionalMovieData) => {
        return {
            id: movieInfo.id,
            title: movieInfo.title,
            overview: movieInfo.overview,
            releaseDate: movieInfo.release_date,
            poster: movieInfo.poster_path,
            addInfo: movieInfo.credits.cast.slice(0, 5)
        };
    });
}
