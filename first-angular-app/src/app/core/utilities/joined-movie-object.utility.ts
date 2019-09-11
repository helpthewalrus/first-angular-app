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
    movieId: movie.id,
    movieTitle: movie.title,
    movieOverview: movie.overview,
    movieReleaseDate: movie.release_date,
    moviePoster: movie.poster_path,
    moviesAddInfo: moviesInfo[index].credits.cast.slice(0, 5)
  }));
}
