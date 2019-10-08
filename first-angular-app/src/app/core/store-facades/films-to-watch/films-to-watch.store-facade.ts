import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { JoinedMovieDataCheckbox } from "../../services/index";
import { FilmsToWatchSelectors, FilmsToWatchActions } from "../../store/index";
import { State } from "../../store/store.model";

@Injectable()
export class FilmsToWatchFacade {
    /**
     * Ngrx Store of the app
     */
    private store: Store<State>;

    /**
     * Observable that stores films to watch chosen by user
     */
    public filmsToWatchList$: Observable<Array<JoinedMovieDataCheckbox>>;

    constructor(store: Store<State>) {
        this.store = store;
        this.filmsToWatchList$ = this.store.select(FilmsToWatchSelectors.selectFilmsToWatchList);
    }

    /**
     * When checkbox "add this film to my watchlist" value changes
     * than dispatch action that adds movie to watchlist
     *
     * @param $event - data about "added to watchlist" movie
     */
    public addMovieToWatchList($event: JoinedMovieDataCheckbox): void {
        this.store.dispatch(new FilmsToWatchActions.AddMovieToWatchList($event));
    }

    /**
     * When checkbox "add this film to my watchlist" value changes
     * than dispatch action that removes movie from watchlist
     *
     * @param $event - data about "added to watchlist" movie
     */
    public removeMovieFromWatchList($event: JoinedMovieDataCheckbox): void {
        this.store.dispatch(new FilmsToWatchActions.RemoveMovieFromWatchList($event));
    }
}
