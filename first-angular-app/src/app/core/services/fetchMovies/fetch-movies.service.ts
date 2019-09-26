import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";

import { Observable, forkJoin, of, BehaviorSubject, timer, throwError } from "rxjs";
import {
    map,
    switchMap,
    scan,
    filter,
    concatAll,
    debounce,
    retryWhen,
    catchError,
    delayWhen,
    tap
} from "rxjs/operators";

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

    /**
     * Stores boolean value whether user is on last page of searched movie
     */
    public isLastPage: boolean = false;

    constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * Create stream to fetch movies and movie cast data from server according to user input
     *
     * @param movieName - search input value used to fetch movies from server
     */
    public getMoviesStream(): Observable<Array<JoinedMovieData | string>> {
        return this.querySubject.asObservable().pipe(
            filter((query: string) => !!query),
            switchMap((movieName: string) => {
                this.pageSubject = new BehaviorSubject(this.currentPage);
                return this.pageSubject.asObservable().pipe(
                    debounce(() => timer(this.countDebounce())),
                    switchMap((currPage: number) => {
                        const params: HttpParams = this.searchMoviesParams(movieName, currPage);
                        return this.http.get<FetchedMovies>(constants.BASE_URL, { params });
                    }),
                    tap((data: FetchedMovies) => (this.totalAmountOfPages = data.total_pages)),
                    map((data: FetchedMovies) => (data.results.length > 0 ? data.results : [])),
                    switchMap(
                        (movies: Array<MovieData>) =>
                            movies.length > 0 ? this.parseFetchedMoviesData(movies) : of([]),
                        (movies: Array<MovieData>, movieInfo: AdditionalMovieData) =>
                            movies.length > 0 ? joinedMovieObject(movieInfo) : [constants.NO_MOVIES_FOUND]
                    ),
                    retryWhen((errors: BehaviorSubject<HttpErrorResponse>) => {
                        return errors.pipe(
                            switchMap((data: HttpErrorResponse) => (data.status !== 429 ? throwError(data) : of(true))),
                            delayWhen(() => timer(this.countDebounce()))
                        );
                    }),
                    scan((acc: Array<JoinedMovieData>, current: Array<JoinedMovieData>) => {
                        if (typeof current[0] !== "string") {
                            acc = [...acc, ...current];
                            return acc;
                        }
                        return current;
                    }, []),
                    catchError((errorObject: HttpErrorResponse) => {
                        const message: string = errorObject.error.status_message
                            ? errorObject.error.status_message
                            : constants.UNKNOWN_ERROR_MESSAGE;
                        return of([message]);
                    })
                );
            })
        );
    }

    /**
     * Count debounce time when fetching another chunk of movies will be available
     */
    public countDebounce(): number {
        const currDate: number = Date.now();
        if (constants.DEBOUNCE_TIME + this.comparisonDate.getTime() < currDate) {
            this.comparisonDate = new Date();
            return 0;
        } else {
            const debouncer: number = this.comparisonDate.getTime() - currDate + constants.DEBOUNCE_TIME;
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
                (movie: MovieData, index: number): Observable<AdditionalMovieData> =>
                    this.fetchMovieInfo(movie.id, index)
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

    /**
     * Method that calls fetching movie data from the next page with increasing current page number
     */
    public getNextPage(): void {
        this.currentPage++;
        if (this.totalAmountOfPages >= this.currentPage) {
            this.pageSubject.next(this.currentPage);
        } else {
            this.isLastPage = true;
        }
    }

    /**
     * Method that calls fetching new movie provided by user
     *
     * @param movieName - input value used to search movies
     */
    public fetchMovies(movieName: string): void {
        this.currentPage = 1;
        this.totalAmountOfPages = undefined;
        this.isLastPage = false;

        this.querySubject.next(movieName);
    }
}
