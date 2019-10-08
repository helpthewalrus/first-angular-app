import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";

import * as isString from "lodash/isString";

import { FetchMoviesService, JoinedMovieData, JoinedMovieDataCheckbox, FilmsToWatchFacade } from "../core/index";

@Component({
    selector: "app-app-movie-search-page",
    templateUrl: "./app-movie-search-page.component.html",
    styleUrls: ["./app-movie-search-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent implements OnInit, OnDestroy {
    /**
     * Ngrx store facade of the app
     */
    public filmsToWatchFacade: FilmsToWatchFacade;

    /**
     * Service for fetching data about movies according to user input
     */
    private fetchMoviesService: FetchMoviesService;

    /**
     * Indicator used for loading data from server
     */
    public isLoading: boolean = false;

    /**
     * Indicator used if user starts searching movie different from the previous search
     */
    public isMovieListHidden: boolean = false;

    /**
     * Indicator used for reflecting paragraph if no input provided
     */
    public noInputProvided: boolean = false;

    /**
     * Observable which contains array of found movies' data
     */
    public resultMovies$: Observable<Array<JoinedMovieData | string>> = null;

    /**
     * Store current searched movie name
     */
    public currentMovie: string;

    /**
     * Stores boolean value whether user is on the last page of searched movie
     */
    public isLastPage: boolean = false;

    /**
     * Lodash function that checks whether provided value is string or not
     */
    public isStringLodash = isString;

    constructor(fetchMoviesService: FetchMoviesService, filmsToWatchFacade: FilmsToWatchFacade) {
        this.fetchMoviesService = fetchMoviesService;
        this.filmsToWatchFacade = filmsToWatchFacade;
    }

    public ngOnInit(): void {
        this.resultMovies$ = this.fetchMoviesService.getMoviesStream().pipe(
            shareReplay(1),
            tap(() => (this.isLoading = false)),
            tap(() => (this.isMovieListHidden = false))
        );
    }

    public ngOnDestroy(): void {
        this.fetchMoviesService.resetSearchQuery();
    }

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

            this.fetchMoviesService.fetchMovies(movieName);
        }
    }

    /**
     * Search additional portion of movies on the server and result is reflected in resultMovies$ variable
     */
    public getNextPage(): void {
        if (!this.isLastPage) {
            this.isLoading = true;
            this.fetchMoviesService.getNextPage();
        }
        this.isLastPage = this.fetchMoviesService.isLastPage;
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
