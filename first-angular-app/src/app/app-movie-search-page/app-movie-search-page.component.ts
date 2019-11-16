import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";

import { Observable, of } from "rxjs";
import { shareReplay, tap, map, switchMap, filter, scan, catchError, concatMap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

import * as isString from "lodash/isString";

import {
    QueryMoviesFacadeService,
    JoinedMovieData,
    JoinedMovieDataCheckbox,
    FilmsToWatchFacade,
    FetchedAdditionalMovies,
    buildMoviesWithChosenInfo,
    SearchError,
    addCheckboxToFoundMovies
} from "../core/index";

import { constants } from "../core/constants";

@Component({
    selector: "app-app-movie-search-page",
    templateUrl: "./app-movie-search-page.component.html",
    styleUrls: ["./app-movie-search-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent implements OnInit /* , OnDestroy */ {
    /**
     * Ngrx store facade of the app
     */
    private filmsToWatchFacade: FilmsToWatchFacade;

    /**
     * Facade service for fetching data about movies according to user input
     */
    private queryMoviesFacadeService: QueryMoviesFacadeService;

    private currentQuery: string;

    /**
     * Number of current page
     */
    public currentPage: number = 1;

    /**
     * Amount of pages fetched according to user input
     */
    public totalAmountOfPages: number;

    /**
     * Indicator used for loading data from server
     */
    public isLoading: boolean = false;

    /**
     * Indicator used if user starts searching movie different from the previous search
     */
    public isMovieListHidden: boolean = false;

    /**
     * Observable which contains array of found movies' data
     */
    public resultMovies$: any /* Observable<Array<JoinedMovieDataCheckbox | string>> */ = null;

    /**
     * Stores boolean value whether user is on the last page of searched movie
     */
    public isLastPage: boolean = false;

    /**
     * Lodash function that checks whether provided value is string or not
     */
    public isStringLodash = isString;

    constructor(queryMoviesFacadeService: QueryMoviesFacadeService, filmsToWatchFacade: FilmsToWatchFacade) {
        this.queryMoviesFacadeService = queryMoviesFacadeService;
        this.filmsToWatchFacade = filmsToWatchFacade;
    }

    public ngOnInit(): void {
        this.resultMovies$ = this.transformFetchedMoviesData();
    }

    private transformFetchedMoviesData(): Observable<any> {
        // Array<string | JoinedMovieDataCheckbox
        return this.queryMoviesFacadeService.getMoviesStream().pipe(
            tap((data: any) => console.log("FROM COMPONENT")),
            tap((data: FetchedAdditionalMovies) => {
                this.totalAmountOfPages = (data as FetchedAdditionalMovies).total_pages;
                this.currentPage = (data as FetchedAdditionalMovies).page;
                this.isLastPage = this.totalAmountOfPages <= this.currentPage ? true : false;
            }),
            scan(
                (acc: FetchedAdditionalMovies, current: FetchedAdditionalMovies) => {
                    if (current.error) {
                        return current;
                    }
                    acc.page = current.page;
                    acc.total_pages = current.total_pages;
                    acc.total_results = current.total_results;
                    acc.results = current.page === 1 ? [...current.results] : [...acc.results, ...current.results];
                    return acc;
                },
                { page: 0, total_pages: 0, total_results: 0, results: [], error: undefined }
            ),
            switchMap((fetchedAdditionalMovies: FetchedAdditionalMovies) => {
                if (fetchedAdditionalMovies.error) {
                    return of([fetchedAdditionalMovies.error]);
                }
                const moviesChosenInfo: Array<JoinedMovieData> = buildMoviesWithChosenInfo(fetchedAdditionalMovies);
                return this.filmsToWatchFacade.filmsToWatchList$.pipe(
                    map((filmsToWatchList: Array<JoinedMovieDataCheckbox>) =>
                        addCheckboxToFoundMovies(moviesChosenInfo as Array<JoinedMovieData>, filmsToWatchList)
                    )
                );
            }),

            // catchError((errorObject: HttpErrorResponse) => {
            //     console.log("ERROR IN COMPONENT", errorObject);
            //     debugger;
            //     const mes: string = this.handleError(errorObject);
            //     return of([mes]);
            // }),
            shareReplay(1),
            tap(() => (this.isLoading = false)),
            tap(() => (this.isMovieListHidden = false))
        );
    }

    // public handleError(errorObject: HttpErrorResponse | string): string {
    //     console.log(errorObject as HttpErrorResponse);
    //     debugger;
    //     let message: string = "";

    //     if (this.isStringLodash(errorObject)) {
    //         message = errorObject as string;
    //     } else if ((errorObject as HttpErrorResponse).message) {
    //         message = (errorObject as HttpErrorResponse).message;
    //     } else if (
    //         (errorObject as HttpErrorResponse).error &&
    //         (errorObject as HttpErrorResponse).error.status_message
    //     ) {
    //         message = (errorObject as HttpErrorResponse).error.status_message;
    //     } else {
    //         message = constants.UNKNOWN_ERROR_MESSAGE;
    //     }

    //     return message;
    // }

    // public ngOnDestroy(): void {
    //     this.fetchMoviesService.resetSearchQuery();
    // }

    /**
     * Search movies on the server and put result into resultMovies$ variable
     *
     * @param movieName - input value used to search movies
     */
    public fetchMovies(movieName: string): void {
        if (movieName.length) {
            this.isLastPage = false;
            this.isLoading = true;
            this.isMovieListHidden = true;
            this.currentQuery = movieName;
            this.currentPage = 1;

            this.queryMoviesFacadeService.fetchMovies({ movieName: this.currentQuery, pageNumber: this.currentPage });
        }
    }

    /**
     * Search additional portion of movies on the server and result is reflected in resultMovies$ variable
     */
    public getNextPage(): void {
        this.currentPage++;
        if (!this.isLastPage) {
            this.isLoading = true;
            this.queryMoviesFacadeService.fetchMovies({ movieName: this.currentQuery, pageNumber: this.currentPage });
        }
    }

    /**
     * When checkbox "add this film to my watchlist" value changes
     * than dispatch data with checkbox state and info about movie
     *
     * @param $event - data about "added to watchlist" movie
     */
    public onAddToWatchList($event: JoinedMovieDataCheckbox): void {
        if ($event.isAddedToWatchList) {
            this.filmsToWatchFacade.addMovieToWatchList($event);
        } else {
            this.filmsToWatchFacade.removeMovieFromWatchList($event);
        }
    }
}
