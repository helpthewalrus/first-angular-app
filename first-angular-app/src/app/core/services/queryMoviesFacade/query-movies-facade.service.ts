import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, BehaviorSubject, of, forkJoin, throwError, timer } from "rxjs";
import { filter, switchMap, retryWhen, tap, debounce, catchError, scan, map, concatMap } from "rxjs/operators";

import { MoviesHttpService } from "./moviesHttp/index";
import {
    AdditionalMovieData,
    MovieData,
    FetchedMovies,
    SearchError,
    FetchedAdditionalMovies
} from "../fetchMovies/index";
import { countDebounce } from "../../utilities/index";
import { constants } from "../../constants";
import * as isString from "lodash/isString";

@Injectable()
export class QueryMoviesFacadeService {
    private moviesHttpService: MoviesHttpService;

    /**
     * Subject that stores data from current page and previous ones
     */
    private pageSubject: BehaviorSubject<number>;

    /**
     * Subject that stores data according to user search input
     */
    private querySubject: BehaviorSubject<{ movieName: string; pageNumber: number }> = new BehaviorSubject({
        movieName: "",
        pageNumber: 1
    });

    /**
     * Date that stores last fetching movies' date
     */
    private comparisonDate: number = 0;

    /**
     * Lodash function that checks whether provided value is string or not
     */
    private isStringLodash = isString;

    constructor(moviesHttpService: MoviesHttpService) {
        this.moviesHttpService = moviesHttpService;
    }

    /**
     * Create stream to fetch movies and movie cast data from server
     */
    public getMoviesData(): Observable<FetchedMovies> | Error {
        return this.querySubject.asObservable().pipe(
            filter((queryObject: { movieName: string; pageNumber: number }) => !!queryObject.movieName),
            switchMap((queryObject: { movieName: string; pageNumber: number }) => {
                // this.pageSubject = new BehaviorSubject(1);
                // return this.pageSubject.asObservable().pipe(
                //     debounce(() => timer(countDebounce(this.comparisonDate))),
                return this.getMovies(
                    queryObject.movieName,
                    queryObject.pageNumber
                ); /* .pipe(
                    catchError((errorObject: HttpErrorResponse) => {
                        throw new Error(this.handleError(errorObject));
                    })
                ) */
                // tap(() => (this.comparisonDate = Date.now())),
                // );
            }),
            catchError((errorObject: HttpErrorResponse) => {
                throw new Error(this.handleError(errorObject));
            })
        );
    }

    public handleError(errorObject: HttpErrorResponse | string): string {
        let message: string = "";

        if (this.isStringLodash(errorObject)) {
            message = errorObject as string;
        } else {
            message =
                (errorObject as HttpErrorResponse).error && (errorObject as HttpErrorResponse).error.status_message
                    ? (errorObject as HttpErrorResponse).error.status_message
                    : constants.UNKNOWN_ERROR_MESSAGE;
        }
        return message;
        // throw new Error(message);
    }

    public getAdditionalMoviesData(fetchedData: Observable<FetchedMovies>): Observable<FetchedAdditionalMovies> {
        return fetchedData.pipe(
            map((fetchedMovies: FetchedMovies) => {
                if (fetchedMovies.results.length <= 0) {
                    throw new Error(constants.NO_MOVIES_FOUND);
                }
                return fetchedMovies;
            }),
            switchMap((movies: FetchedMovies) => {
                return forkJoin(
                    movies.results.map(
                        (movie: MovieData): Observable<AdditionalMovieData> => this.getMovieDetails(movie.id)
                    )
                ).pipe(
                    map((additionalMoviesData: Array<AdditionalMovieData>) => {
                        return { ...movies, results: additionalMoviesData };
                    })
                );
            }),
            // retryWhen((errors: BehaviorSubject<HttpErrorResponse>) =>
            // errors.pipe(switchMap((data: HttpErrorResponse) => (data.status !== 429 ? throwError(data) : of(true))))
            // ),
            // tap(() => (this.comparisonDate = Date.now())),
            catchError((errorObject: HttpErrorResponse) => {
                throw new Error(this.handleError(errorObject));
            })
        );
    }

    public getMoviesStream(): Observable<FetchedAdditionalMovies> {
        return this.getAdditionalMoviesData(this.getMoviesData() as Observable<FetchedMovies>);
        //                 scan(
        //                     (acc: FetchedAdditionalMovies, current: FetchedAdditionalMovies) => {
        //                         acc.page = current.page;
        //                         acc.total_pages = current.total_pages;
        //                         acc.total_results = current.total_results;
        //                         acc.results = [...acc.results, ...current.results];
        //                         return acc;
        //                     },
        //                     { page: 0, total_pages: 0, total_results: 0, results: [] } as FetchedAdditionalMovies
        //                 )
        //             );
        //         }
        //     }),
        //     catchError((errorObject: HttpErrorResponse | string) => {
        //         throw new Error(this.handleError(errorObject));
        //     })
        // );
    }

    /**
     * Method that calls fetching movie data from the next page with increasing current page number
     */
    public getNextPage(pageNumber: number): void {
        this.pageSubject.next(pageNumber);
    }

    /**
     * Method that calls fetching new movie provided by user
     *
     * @param movieName - input value used to search movies
     */
    public fetchMovies(argObject: { movieName: string; pageNumber: number }): void {
        this.querySubject.next(argObject);
    }

    public getMovies(movieName: string, pageNumber: number): Observable<FetchedMovies> {
        return this.moviesHttpService.getMovies(movieName, pageNumber);
    }

    public getMovieDetails(movieId: number): Observable<AdditionalMovieData> {
        return this.moviesHttpService.getMovieDetails(movieId);
    }
}
