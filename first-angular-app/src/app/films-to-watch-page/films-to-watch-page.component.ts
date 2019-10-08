import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";

import { FilmsToWatchFacade, JoinedMovieDataCheckbox } from "../core/index";

@Component({
    selector: "app-films-to-watch-page",
    templateUrl: "./films-to-watch-page.component.html",
    styleUrls: ["./films-to-watch-page.component.scss"]
})
export class FilmsToWatchPageComponent implements OnInit {
    /**
     * Indicator whether film overview is visible/hidden
     */
    public panelOpenState = false;

    /**
     * Observable with array of films chosen by user as "films to watch"
     */
    public filmsToWatch$: Observable<Array<JoinedMovieDataCheckbox>>;

    /**
     * Ngrx store facade of the app
     */
    public filmsToWatchFacade: FilmsToWatchFacade;

    constructor(filmsToWatchFacade: FilmsToWatchFacade) {
        this.filmsToWatchFacade = filmsToWatchFacade;
    }

    public ngOnInit(): void {
        this.filmsToWatch$ = this.filmsToWatchFacade.filmsToWatchList$;
    }
}
