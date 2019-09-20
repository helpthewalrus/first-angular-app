import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, forkJoin, of, BehaviorSubject, from, zip } from "rxjs";
import { map, concatMap, switchMap, tap, mergeMap, scan, catchError, debounceTime } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies, AdditionalMovieData, JoinedMovieData } from "./models/index";
import { joinedMovieObject } from "../../utilities/index";

@Injectable()
export class FetchMoviesService {
  /**
   * Service with methods to perform HTTP-requests
   */
  private http: HttpClient;

  /**
   * Variable that contains current page from where data has been fetched
   */
  private currentPage = 1;

  /**
   * Subject that saves data from current page and previous ones
   */
  public behaviorSubject: BehaviorSubject<number> = new BehaviorSubject(this.currentPage);

  /**
   * Stream from behaviourSubject to transfer data to the components
   */
  public movieStream$ = this.behaviorSubject.asObservable();

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Create stream to fetch movies and movie cast data from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public getMoviesStream(movieName: string): Observable<Array<JoinedMovieData>> {
    return this.movieStream$.pipe(
      switchMap((currPage: number) => {
        const params: HttpParams = this.searchMoviesParams(movieName, currPage);
        return this.http.get<FetchedMovies>(constants.BASE_URL, { params });
      }),
      map((data: FetchedMovies) => {
        if (data.results.length > 0) {
          return data.results;
        }
        return [];
      }),
      switchMap(
        (movies: Array<MovieData>) => {
          if (movies.length > 0) {
            return this.parseFetchedMoviesData(movies);
          } else {
            return of([]);
          }
        },
        (movies: Array<MovieData>, moviesInfo: Array<AdditionalMovieData>) => {
          if (movies.length && moviesInfo.length) {
            return joinedMovieObject(movies, moviesInfo);
          }
          return [];
        }
      ),
      scan((acc: Array<JoinedMovieData>, curr: Array<JoinedMovieData>) => {
        acc = [...acc, ...curr];
        return acc;
      }, [])
    );
  }

  /**
   * Emit an array of movies' data in the exact same order as the passed array
   *
   * @param movies - array with movies' data to extract movie id in order to use in http request
   */
  private parseFetchedMoviesData(movies: Array<MovieData>): Observable<Array<AdditionalMovieData>> {
    return forkJoin(movies.map((movie: MovieData): Observable<AdditionalMovieData> => this.fetchMovieInfo(movie.id)));
  }

  /**
   * Fetch movie cast info (names, avatars)
   *
   * @param movieId - movie id used to fetch data about movie and its cast
   */
  private fetchMovieInfo(movieId: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("append_to_response", "credits");

    return this.http.get(`${constants.MOVIE_INFO_URL}${movieId}`, { params });
  }

  /**
   * Create HttpParams object to use while fetching data from server
   *
   * @param movieName - search input value used to fetch movies from server
   * @param pageNumber - current page number user wants to fetch data from
   */
  private searchMoviesParams(movieName: string, pageNumber: number): HttpParams {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("language", "en-US");
    params = params.append("query", movieName);
    params = params.append("page", `${pageNumber}`);
    params = params.append("include_adult", "false");
    return params;
  }

  /** Method that calls fetching movie data from the next page with increasing current page number */
  public getNextPage(): Observable<number> {
    this.currentPage++;
    this.behaviorSubject.next(this.currentPage);
    return this.movieStream$;
  }
}
