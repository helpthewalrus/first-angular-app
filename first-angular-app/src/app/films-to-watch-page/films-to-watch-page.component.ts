import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { FilmsToWatchFacade, JoinedMovieDataCheckbox } from "../core/index";

@Component({
    selector: "app-films-to-watch-page",
    templateUrl: "./films-to-watch-page.component.html",
    styleUrls: ["./films-to-watch-page.component.scss"]
})
export class FilmsToWatchPageComponent implements OnInit {
    /**
     * Ngrx store facade of the app
     */
    private filmsToWatchFacade: FilmsToWatchFacade;

    /**
     * Indicator whether film overview is visible/hidden
     */
    public panelOpenState = false;

    /**
     * Observable with array of films chosen by user as "films to watch"
     */
    public filmsToWatch$: Observable<Array<JoinedMovieDataCheckbox>>;

    constructor(filmsToWatchFacade: FilmsToWatchFacade) {
        this.filmsToWatchFacade = filmsToWatchFacade;
    }

    public ngOnInit(): void {
        this.filmsToWatch$ = this.filmsToWatchFacade.filmsToWatchList$.pipe(shareReplay(1));
    }
}
