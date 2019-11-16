import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ɵConsole } from "@angular/core";

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
    public getMoviesData(): Observable<FetchedMovies | HttpErrorResponse> {
        console.log("getMoviesData");
        return this.querySubject.asObservable().pipe(
            tap((data: any) => console.log(data)),
            filter((queryObject: { movieName: string; pageNumber: number }) => !!queryObject.movieName),
            debounce(() => timer(countDebounce(this.comparisonDate))),
            switchMap((queryObject: { movieName: string; pageNumber: number }) => {
                // this.pageSubject = new BehaviorSubject(1);
                // return this.pageSubject.asObservable().pipe(
                return this.getMovies(
                    queryObject.movieName,
                    queryObject.pageNumber
                ); /* .pipe(
                    catchError((errorObject: HttpErrorResponse) => {
                        throw new Error(this.handleError(errorObject));
                    })
                ) */
                // );
            }),
            tap(() => (this.comparisonDate = Date.now())),
            catchError((errorObject: HttpErrorResponse) => {
                console.log("catchError triggered", errorObject);
                const mess: any = this.handleError(errorObject);
                return of({
                    page: undefined,
                    total_results: undefined,
                    total_pages: undefined,
                    results: undefined,
                    error: mess
                });
            })
            // catchError(this.handleError)
        );
    }

    public handleError(errorObject: HttpErrorResponse | string): string {
        console.log(errorObject as HttpErrorResponse);
        let message: string = "";

        if (this.isStringLodash(errorObject)) {
            message = errorObject as string;
        } else if ((errorObject as HttpErrorResponse).message) {
            message = (errorObject as HttpErrorResponse).message;
        } else if (
            (errorObject as HttpErrorResponse).error &&
            (errorObject as HttpErrorResponse).error.status_message
        ) {
            message = (errorObject as HttpErrorResponse).error.status_message;
        } else {
            message = constants.UNKNOWN_ERROR_MESSAGE;
        }

        return message;
    }

    public getAdditionalMoviesData(
        fetchedData: Observable<FetchedMovies>
    ): Observable<FetchedAdditionalMovies | HttpErrorResponse> {
        console.log("getAdditionalMoviesData", fetchedData);
        return fetchedData.pipe(
            tap((data: any) => console.log("getAdditionalMoviesData IN PIPE", data)),
            switchMap((fetchedMovies: FetchedMovies) => {
                if (fetchedMovies.error) {
                    return throwError(fetchedMovies.error);
                } else if (fetchedMovies.results.length <= 0) {
                    console.log("COMPARISON");
                    return throwError(constants.NO_MOVIES_FOUND);
                } else {
                    return of(fetchedMovies);
                }
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
            retryWhen((errors: BehaviorSubject<HttpErrorResponse>) =>
                errors.pipe(switchMap((data: HttpErrorResponse) => (data.status !== 429 ? throwError(data) : of(true))))
            ),
            tap(() => (this.comparisonDate = Date.now())),
            catchError((errorObject: HttpErrorResponse | string) => {
                console.log("getAdditionalMoviesData CATCH ERROR", errorObject);
                // return throwError(this.handleError(errorObject));

                // console.log("catchError triggered", errorObject);
                const mess: any = this.handleError(errorObject);
                return of({
                    page: undefined,
                    total_results: undefined,
                    total_pages: undefined,
                    results: undefined,
                    error: mess
                });
            })
        );
    }

    public getMoviesStream(): Observable<FetchedAdditionalMovies> {
        const res: any = this.getAdditionalMoviesData(this.getMoviesData() as Observable<
            FetchedMovies
        >); /* .pipe(
            catchError((errorObject: HttpErrorResponse) => {
                console.log("getAdditionalMoviesData CATCH ERROR", errorObject);
                // return throwError(this.handleError(errorObject));

                // console.log("catchError triggered", errorObject);
                debugger;
                const mess: any = this.handleError(errorObject);
                return of({
                    page: undefined,
                    total_results: undefined,
                    total_pages: undefined,
                    results: undefined,
                    error: mess
                });
            })
        ); */
        console.log(res);
        return res;
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
        // return new HttpErrorResponse({ error: { status_message: "Haha" }, status: 504 });
        return this.moviesHttpService.getMovies(movieName, pageNumber);
    }

    public getMovieDetails(movieId: number): Observable<AdditionalMovieData> {
        return this.moviesHttpService.getMovieDetails(movieId);
    }
}
