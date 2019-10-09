import { AdditionalMovieData, JoinedMovieData } from "../index";

/**
 * Create array of objects with combined data about movies and their cast
 *
 * @param moviesInfo - array of objects with fetched data about movies
 */
export function joinedMovieObject(moviesInfo: Array<AdditionalMovieData>): Array<JoinedMovieData> {
    return moviesInfo.map((movieInfo: AdditionalMovieData) => {
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
