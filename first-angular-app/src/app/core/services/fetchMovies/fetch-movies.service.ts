import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";

import { Observable, forkJoin, of, BehaviorSubject, timer, throwError } from "rxjs";
import { map, switchMap, scan, filter, debounce, retryWhen, catchError, tap } from "rxjs/operators";

import * as isString from "lodash/isString";

import { constants } from "../../constants";
import {
    MovieData,
    FetchedMovies,
    AdditionalMovieData,
    JoinedMovieData,
    JoinedMovieDataCheckbox
} from "./models/index";
import * as Utils from "../../utilities/index";
import { FilmsToWatchFacade } from "../../store-facades/index";

@Injectable()
export class FetchMoviesService {
    /**
     * Ngrx store facade to work with store of the app
     */
    private filmsToWatchFacade: FilmsToWatchFacade;

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

    constructor(http: HttpClient, filmsToWatchFacade: FilmsToWatchFacade) {
        this.http = http;
        this.filmsToWatchFacade = filmsToWatchFacade;
    }

    /**
     * Create stream to fetch movies and movie cast data from server according to user input
     *
     * @param movieName - search input value used to fetch movies from server
     */
    public getMoviesStream(): Observable<Array<JoinedMovieDataCheckbox | string>> {
        return this.querySubject.asObservable().pipe(
            filter((query: string) => !!query),
            switchMap((movieName: string) => {
                this.pageSubject = new BehaviorSubject(this.currentPage);
                return this.pageSubject.asObservable().pipe(
                    debounce(() => timer(this.countDebounce())),
                    switchMap((currPage: number) => {
                        const params: HttpParams = this.searchMoviesParams(movieName, currPage);
                        return this.http.get<FetchedMovies>(constants.BASE_URL, { params }).pipe(
                            tap((data: FetchedMovies) => (this.totalAmountOfPages = data.total_pages)),
                            map((data: FetchedMovies) => (data.results.length > 0 ? data.results : []))
                        );
                    }),
                    switchMap((movies: Array<MovieData>) =>
                        movies.length <= 0
                            ? of([])
                            : this.parseFetchedMoviesData(movies).pipe(
                                  map((moviesInfo: Array<AdditionalMovieData>) =>
                                      movies.length > 0
                                          ? Utils.joinedMovieObject(moviesInfo)
                                          : [constants.NO_MOVIES_FOUND]
                                  )
                              )
                    ),
                    retryWhen((errors: BehaviorSubject<HttpErrorResponse>) => {
                        return errors.pipe(
                            switchMap((data: HttpErrorResponse) => (data.status !== 429 ? throwError(data) : of(true)))
                        );
                    }),
                    tap(() => (this.comparisonDate = new Date())),
                    scan((acc: Array<JoinedMovieDataCheckbox>, current: Array<JoinedMovieDataCheckbox>) => {
                        if (typeof current[0] !== "string") {
                            acc = [...acc, ...current];
                            return acc;
                        }
                        return current;
                    }, []),
                    switchMap((movies: Array<JoinedMovieData>) =>
                        movies.length <= 0
                            ? of([])
                            : this.getChosenMoviesObservable().pipe(
                                  map((filmsToWatchList: Array<JoinedMovieDataCheckbox>) =>
                                      !isString(movies[0])
                                          ? this.addCheckboxToFoundMovies(movies, filmsToWatchList)
                                          : [constants.NO_MOVIES_FOUND]
                                  )
                              )
                    ),
                    catchError((errorObject: HttpErrorResponse) => {
                        const message: string =
                            errorObject.error && errorObject.error.status_message
                                ? errorObject.error.status_message
                                : constants.UNKNOWN_ERROR_MESSAGE;
                        return of([message]);
                    })
                );
            })
        );
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

    /**
     * When user leaves search movies page than reset received data
     */
    public resetSearchQuery(): void {
        this.querySubject.next(undefined);
    }

    /**
     * Get observable with chosen "to watch" movies
     */
    private getChosenMoviesObservable(): Observable<Array<JoinedMovieDataCheckbox>> {
        return this.filmsToWatchFacade.filmsToWatchList$;
    }

    /**
     * Add isAddedToWatchList property to existing array of found movies
     *
     * @param movies - array of found movies
     * @param filmsToWatchList - array with chosen "to watch" movies
     */
    private addCheckboxToFoundMovies(
        movies: Array<JoinedMovieData>,
        filmsToWatchList: Array<JoinedMovieDataCheckbox>
    ): Array<JoinedMovieDataCheckbox> {
        return movies.map((movie: JoinedMovieData) => {
            const isAddedToWatchList: boolean = filmsToWatchList.find(
                (item: JoinedMovieDataCheckbox) => item.id === movie.id
            )
                ? true
                : false;
            return {
                ...movie,
                isAddedToWatchList
            };
        });
    }

    /**
     * Count debounce time when fetching another chunk of movies will be available
     */
    private countDebounce(): number {
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
    private parseFetchedMoviesData(movies: Array<MovieData>): Observable<Array<AdditionalMovieData>> {
        return forkJoin(
            movies.map((movie: MovieData): Observable<AdditionalMovieData> => this.fetchMovieInfo(movie.id))
        );
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

        return this.http.get(`${constants.MOVIE_INFO_URL}${movieId}`, { params }) as Observable<AdditionalMovieData>;
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
}
