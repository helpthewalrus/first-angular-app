import { MovieData, AdditionalMovieData, JoinedMovieData } from "../index";

/**
 * create array of objects with combined data about movies and their cast
 *
 * @param movies - array with fetched data about movies
 * @param moviesInfo - array with fetched data about movies' cast
 */
export function joinedMovieObject(
  movies: Array<MovieData>,
  moviesInfo: Array<AdditionalMovieData>
): Array<JoinedMovieData> {
  return movies.map((movie: MovieData, index: number) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    poster: movie.poster_path,
    addInfo: moviesInfo[index].credits.cast.slice(0, 5)
  }));
}
