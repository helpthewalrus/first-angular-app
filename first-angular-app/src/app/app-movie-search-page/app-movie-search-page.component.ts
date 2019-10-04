import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";

import { FetchMoviesService, JoinedMovieData, JoinedMovieDataCheckbox } from "../core/index";
import { State } from "../core/store/reducers";

// CHANGE IMPORTS
import { AddMovieToWatchList, RemoveMovieToWatchList } from "../core/store/films-to-watch/films-to-watch.actions";
@Component({
    selector: "app-app-movie-search-page",
    templateUrl: "./app-movie-search-page.component.html",
    styleUrls: ["./app-movie-search-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent implements OnInit, OnDestroy {
    /**
     * Ngrx Store of the app
     */
    private store: Store<State>;

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
     * Stores boolean value whether user is on last page of searched movie
     */
    public isLastPage: boolean = false;

    constructor(fetchMoviesService: FetchMoviesService, store: Store<State>) {
        this.fetchMoviesService = fetchMoviesService;
        this.store = store;
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
     * Search movies on the server and put result into resultMovies variable,
     * change state of paragraph with loading state
     * change state of paragraph if no input provided
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
     * Search additional portion of movies on the server and result is reflected in resultMovies variable,
     * change state of paragraph with loading state
     */
    public getNextPage(): void {
        if (!this.isLastPage) {
            this.isLoading = true;
            this.fetchMoviesService.getNextPage();
        }
        this.isLastPage = this.fetchMoviesService.isLastPage;
    }

    /**
     * Checks whether provided value is string or not
     *
     * @param value - checked value
     */
    public isString(value: JoinedMovieData | string): boolean {
        return typeof value === "string";
    }

    /**
     * When checkbox "add this film to my watchlist" value changes
     * than get data with checkbox state and info about movie
     */
    public onAddToWatchList($event: JoinedMovieDataCheckbox): void {
        if ($event.isAddedToWatchList) {
            this.store.dispatch(new AddMovieToWatchList($event));
        } else {
            this.store.dispatch(new RemoveMovieToWatchList($event));
        }
    }
}
