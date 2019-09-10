import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, forkJoin } from "rxjs";
import { map, concatMap } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies, AdditionalMovieData, JoinedMovieData } from "./models/index";

@Injectable()
export class FetchMoviesService {
  /** service with methods to perform HTTP-requests */
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * create stream to fetch movies and movie cast data from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public fetchMovies(movieName: string): Observable<Array<JoinedMovieData>> {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("language", "en-US");
    params = params.append("query", movieName);
    params = params.append("page", "1");
    params = params.append("include_adult", "false");

    return this.http
      .get<FetchedMovies>(constants.BASE_URL, {
        params
      })
      .pipe(
        map((data: FetchedMovies) => {
          if (data.results.length > 0) {
            return data.results;
          }
        }),
        concatMap(
          (movies: Array<MovieData>) => {
            return this.parseFetchedMoviesData(movies);
          },
          (movies: Array<MovieData>, moviesInfo: Array<AdditionalMovieData>) => {
            return this.createDataObject(movies, moviesInfo);
          }
        ),
        map((moviesData: Array<JoinedMovieData>) => {
          return moviesData.filter((item: JoinedMovieData) => {
            if (item.movieOverview && item.moviePoster && item.movieReleaseDate && item.movieTitle) {
              return item;
            }
          });
        })
      );
  }

  /**
   * emit an array of movies' data in the exact same order as the passed array
   *
   * @param movies - array with movies' data to extract movie id in order to use in http request
   */
  public parseFetchedMoviesData(movies: Array<MovieData>): Observable<Array<AdditionalMovieData>> {
    return forkJoin(movies.map((movie: MovieData): Observable<AdditionalMovieData> => this.fetchMovieInfo(movie.id)));
  }

  /**
   * fetch movie cast info (names, avatars)
   *
   * @param movieId - movie id used to fetch data about movie and its cast
   */
  public fetchMovieInfo(movieId: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("append_to_response", "credits");

    return this.http.get(`${constants.MOVIE_INFO_URL}${movieId}`, { params });
  }

  /**
   * create array of objects with combined data about movies and their cast
   *
   * @param movies - array with fetched data about movies
   * @param moviesInfo - array with fetched data about movies' cast
   */
  public createDataObject(movies: Array<MovieData>, moviesInfo: Array<AdditionalMovieData>): Array<JoinedMovieData> {
    return movies.map((movie: MovieData, index: number) => ({
      movieId: movie.id,
      movieTitle: movie.title,
      movieOverview: movie.overview,
      movieReleaseDate: movie.release_date,
      moviePoster: movie.poster_path,
      moviesAddInfo: moviesInfo[index].credits.cast.slice(0, 5)
    }));
  }
}
