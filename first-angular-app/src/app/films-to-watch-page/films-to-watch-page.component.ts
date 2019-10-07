import { Component, OnInit } from "@angular/core";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { JoinedMovieDataCheckbox } from "../core/index";
import { State } from "../core/store/reducers";
import { FilmsToWatchSelectors } from "../core/store/films-to-watch/index";

@Component({
    selector: "app-films-to-watch-page",
    templateUrl: "./films-to-watch-page.component.html",
    styleUrls: ["./films-to-watch-page.component.scss"]
})
export class FilmsToWatchPageComponent implements OnInit {
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
        this.store = store;
    }

    public ngOnInit(): void {
        this.filmsToWatch$ = this.store.select(FilmsToWatchSelectors.selectFilmsToWatchList);
    }
}
