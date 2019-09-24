import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, forkJoin, of, BehaviorSubject, timer } from "rxjs";
import { map, switchMap, scan, filter, distinctUntilChanged, concatAll, debounce } from "rxjs/operators";

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
  private currentPage: number = 1;

  /**
   * Subject that stores data from current page and previous ones
   */
  private pageSubject: BehaviorSubject<number>;

  /**
   * Subject that stores data according to user search input
   */
  private querySubject: BehaviorSubject<string> = new BehaviorSubject("");

  /**
   * Date that stores last fetching movies' date
   */
  private comparisonDate: Date = new Date(0);

  /**
   * Total amount of pages with searched movie
   */
  private totalAmountOfPages: number;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Create stream to fetch movies and movie cast data from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public getMoviesStream(): Observable<Array<JoinedMovieData>> {
    return this.querySubject.asObservable().pipe(
      distinctUntilChanged(),

      filter((query: string) => !!query),

      switchMap((movieName: string) => {
        this.pageSubject = new BehaviorSubject(this.currentPage);
        return this.pageSubject.asObservable().pipe(
          debounce(() => timer(this.countDebounce())),

          switchMap((currPage: number) => {
            const params: HttpParams = this.searchMoviesParams(movieName, currPage);
            return this.http.get<FetchedMovies>(constants.BASE_URL, { params });
          }),

          map((data: FetchedMovies) => {
            if (data.results.length > 0) {
              this.totalAmountOfPages = data.total_pages;
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
            (movies: Array<MovieData>, movieInfo: AdditionalMovieData) => {
              if (movies.length) {
                return joinedMovieObject(movieInfo);
              }
              return [];
            }
          ),

          scan((acc: Array<JoinedMovieData>, curr: Array<JoinedMovieData>) => {
            acc = [...acc, ...curr];
            return acc;
          }, [])
        );
      })
    );
  }

  /**
   * Count debounce time for fetching movies because of requests limit
   */
  public countDebounce(): number {
    const currDate: number = Date.now();
    if (10000 + this.comparisonDate.getTime() < currDate) {
      this.comparisonDate = new Date();
      return 0;
    } else {
      const debouncer: number = this.comparisonDate.getTime() - currDate + 10000;
      this.comparisonDate = new Date();
      return debouncer;
    }
  }

  /**
   * Emit an array of movies' data in the exact same order as the passed array
   *
   * @param movies - array with movies' data to extract movie id in order to use in http request
   */
  private parseFetchedMoviesData(movies: Array<MovieData>): Observable<AdditionalMovieData> {
    return forkJoin(
      movies.map(
        (movie: MovieData, index: number): Observable<AdditionalMovieData> => this.fetchMovieInfo(movie.id, index)
      )
    ).pipe(concatAll());
  }

  /**
   * Fetch movie cast info (names, avatars)
   *
   * @param movieId - movie id used to fetch data about movie and its cast
   */
  private fetchMovieInfo(movieId: number, index: number): Observable<any> {
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
  public getNextPage(): void {
    this.currentPage++;
    this.pageSubject.next(this.currentPage);
  }

  /**
   * Method that calls fetching new movie provided by user
   *
   * @param movieName - input value used to search movies
   */
  public fetchMovies(movieName: string): void {
    this.currentPage = 1;
    this.querySubject.next(movieName);
  }
}
