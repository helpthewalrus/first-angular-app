import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, forkJoin, of, BehaviorSubject, from } from "rxjs";
import { map, concatMap, switchMap, tap, mergeMap, scan } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies, AdditionalMovieData, JoinedMovieData } from "./models/index";
import { joinedMovieObject } from "../../utilities/index";

@Injectable()
export class FetchMoviesService {
  /** service with methods to perform HTTP-requests */
  private http: HttpClient;

  /** variable that contains current page from where data has been fetched */
  private currentPage = 1;

  /** Subject that saves data current page and previous ones */
  public behaviorSubject: BehaviorSubject<number> = new BehaviorSubject(this.currentPage);

  public movieStream$ = this.behaviorSubject.asObservable();

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * create stream to fetch movies and movie cast data from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public getMoviesStream(movieName: string): Observable<Array<JoinedMovieData>> {
    return this.movieStream$.pipe(
      map((currPage: number) => {
        console.log("map", currPage);
        return currPage;
      }),
      switchMap((currPage: number) => {
        const params: any = this.searchMoviesParams(movieName, currPage);
        console.log("currPage", currPage, "/n", "params", params);
        // console.log("currPage", currPage);
        // return of(this.searchMoviesParams(movieName, currPage)).pipe(
        //   tap((data: any) => console.log("data", data)),
        //   mergeMap((params: HttpParams) => {
        //     console.log("params", params);
        const fetch: any = this.http.get<FetchedMovies>(constants.BASE_URL, {
          params
        });
        // .pipe(
        //   map((data: FetchedMovies) => {
        //     console.log("map FetchedMovies", data);
        //     if (data.results.length > 0) {
        //       return data.results;
        //     }
        //     return [];
        //   }),
        //   switchMap(
        //     (movies: Array<MovieData>) => {
        //       if (movies.length > 0) {
        //         return this.parseFetchedMoviesData(movies);
        //       } else {
        //         return of([]);
        //       }
        //     },
        //     (movies: Array<MovieData>, moviesInfo: Array<AdditionalMovieData>) => {
        //       if (movies.length && moviesInfo.length) {
        //         return joinedMovieObject(movies, moviesInfo);
        //       }
        //       return [];
        //     }
        //   )
        // );
        return fetch;
        //   })
        // );
      }),
      map((data: FetchedMovies) => {
        console.log("map FetchedMovies", data);
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
      // scan((acc: Array<JoinedMovieData>, curr: Array<JoinedMovieData>) => {
      //   console.log("scan");
      //   acc = [...acc, ...curr];
      //   return acc;
      // }, []),
      tap((data: any) => console.log("after scan data", data))
    );
  }

  /**
   * emit an array of movies' data in the exact same order as the passed array
   *
   * @param movies - array with movies' data to extract movie id in order to use in http request
   */
  private parseFetchedMoviesData(movies: Array<MovieData>): Observable<Array<AdditionalMovieData>> {
    return forkJoin(movies.map((movie: MovieData): Observable<AdditionalMovieData> => this.fetchMovieInfo(movie.id)));
  }

  /**
   * fetch movie cast info (names, avatars)
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

  /** method that calls fetching movie data from next page in comparison to current page */
  public getNextPage(): any {
    this.currentPage++;
    this.behaviorSubject.next(this.currentPage);
    return this.movieStream$;
  }
}
