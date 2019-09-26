import { AdditionalMovieData, JoinedMovieData } from "../index";

/**
 * create array of objects with combined data about movies and their cast
 *
 * @param movieInfo - object with fetched data about movie
 */
export function joinedMovieObject(movieInfo: AdditionalMovieData): Array<JoinedMovieData> {
    return [
        {
            id: movieInfo.id,
            title: movieInfo.title,
            overview: movieInfo.overview,
            releaseDate: movieInfo.release_date,
            poster: movieInfo.poster_path,
            addInfo: movieInfo.credits.cast.slice(0, 5)
        }
    ];
}
