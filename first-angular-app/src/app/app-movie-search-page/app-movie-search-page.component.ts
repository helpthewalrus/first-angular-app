import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";

import { Observable, of } from "rxjs";
import { shareReplay, tap, map, switchMap, filter, scan } from "rxjs/operators";

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
    public resultMovies$: Observable<Array<JoinedMovieDataCheckbox | string>> = null;

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

    private transformFetchedMoviesData(): Observable<Array<string> | JoinedMovieDataCheckbox[]> {
        return this.queryMoviesFacadeService.getMoviesStream().pipe(
            tap((data: FetchedAdditionalMovies | SearchError) => {
                if (!(data as SearchError).error) {
                    this.totalAmountOfPages = (data as FetchedAdditionalMovies).total_pages;
                    this.currentPage = (data as FetchedAdditionalMovies).page;
                    this.isLastPage = this.totalAmountOfPages <= this.currentPage ? true : false;
                }
            }),
            scan(
                (acc: FetchedAdditionalMovies, current: FetchedAdditionalMovies) => {
                    acc.page = current.page;
                    acc.total_pages = current.total_pages;
                    acc.total_results = current.total_results;
                    acc.results = [...acc.results, ...current.results];
                    return acc;
                },
                { page: 0, total_pages: 0, total_results: 0, results: [] } as FetchedAdditionalMovies
            ),
            map((fetchedAdditionalMovies: FetchedAdditionalMovies | SearchError) => {
                if ((fetchedAdditionalMovies as SearchError).error) {
                    return fetchedAdditionalMovies as SearchError;
                }
                return buildMoviesWithChosenInfo(fetchedAdditionalMovies as FetchedAdditionalMovies);
            }),
            switchMap((moviesJoinedData: Array<JoinedMovieData> | SearchError) => {
                if ((moviesJoinedData as SearchError).error) {
                    return of([(moviesJoinedData as SearchError).error]);
                }
                return this.filmsToWatchFacade.filmsToWatchList$.pipe(
                    map((filmsToWatchList: Array<JoinedMovieDataCheckbox>) =>
                        addCheckboxToFoundMovies(moviesJoinedData as Array<JoinedMovieData>, filmsToWatchList)
                    )
                );
            }),
            shareReplay(1),
            tap(() => (this.isLoading = false)),
            tap(() => (this.isMovieListHidden = false))
        );
    }

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

            this.queryMoviesFacadeService.fetchMovies({ movieName, pageNumber: this.currentPage });
        }
    }

    /**
     * Search additional portion of movies on the server and result is reflected in resultMovies$ variable
     */
    public getNextPage(): void {
        this.currentPage++;
        if (!this.isLastPage) {
            this.isLoading = true;
            this.queryMoviesFacadeService.getNextPage(this.currentPage);
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
