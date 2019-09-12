import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, forkJoin, of } from "rxjs";
import { map, concatMap } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies, AdditionalMovieData, JoinedMovieData } from "./models/index";
import { joinedMovieObject } from "../../utilities/index";

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
          return [];
        }),
        concatMap(
          (movies: Array<MovieData>) => {
            if (movies.length > 0) {
              return this.parseFetchedMoviesData(movies);
            } else {
              return of([]);
            }
          },
          (movies: Array<MovieData>, moviesInfo: Array<AdditionalMovieData>) => {
            console.log(moviesInfo);
            if (movies.length && moviesInfo.length) {
              return joinedMovieObject(movies, moviesInfo);
            }
            return [];
          }
        )
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
}
