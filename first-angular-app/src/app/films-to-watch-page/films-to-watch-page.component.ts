import { Component } from "@angular/core";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { JoinedMovieDataCheckbox } from "../core/index";
import { State, selectFilmsToWatchList } from "../core/store/reducers";

@Component({
    selector: "app-films-to-watch-page",
    templateUrl: "./films-to-watch-page.component.html",
    styleUrls: ["./films-to-watch-page.component.scss"]
})
export class FilmsToWatchPageComponent {
    public panelOpenState = false;

    /**
     * Observable with array of films chosen by user as "films to watch"
     */
    public filmsToWatch$: Observable<Array<JoinedMovieDataCheckbox>>;
    /**
     * Ngrx Store of the app
     */
    private store: Store<State>;

    constructor(store: Store<State>) {
        this.filmsToWatch$ = store.select(selectFilmsToWatchList);
    }
}
