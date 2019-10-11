import { Injectable } from "@angular/core";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

import { FilmsToWatchActions, CommonActions } from "../store/index";
import { JoinedMovieDataCheckbox, ModifyLocalStorageService } from "../services/index";

@Injectable()
export class FilmsToWatchEffects {
    private actions$: Actions;
    private modifyLocalStorageService: ModifyLocalStorageService;
    private moviesFromStorageKey = "__moviesToWatch";

    /**
     * Effect that adds or removes movieToWatch from localStorage
     */
    @Effect({ dispatch: false })
    public storeMoviesToWatch$: Observable<
        FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList
    >;

    /**
     * Effect that loads data from localStorage into app store during app initialization
     */
    @Effect()
    public getMoviesToWatch$: Observable<FilmsToWatchActions.GetMoviesToWatchSuccess>;

    constructor(actions: Actions, modifyLocalStorageService: ModifyLocalStorageService) {
        this.actions$ = actions;

        this.modifyLocalStorageService = modifyLocalStorageService;

        this.storeMoviesToWatch$ = this.actions$.pipe(
            ofType(
                FilmsToWatchActions.FilmsToWatchActionTypes.AddMovieToWatchList,
                FilmsToWatchActions.FilmsToWatchActionTypes.RemoveMovieFromWatchList
            ),
            tap(
                (
                    movieToWatch: FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList
                ) => this.addOrRemoveMovieFromLocalStorage(movieToWatch)
            )
        );

        this.getMoviesToWatch$ = this.actions$.pipe(
            ofType(CommonActions.CommonActionTypes.Initialize),
            map(() => {
                const moviesToWatch: Array<JoinedMovieDataCheckbox> =
                    this.modifyLocalStorageService.getInfoFromLocalStorage(this.moviesFromStorageKey) || [];

                return new FilmsToWatchActions.GetMoviesToWatchSuccess(moviesToWatch);
            })
        );
    }

    /**
     * Add or remove "movieToWatch" from localStorage when checkbox is clicked
     *
     * @param movieToWatch - data about movie that must be added or removed from localStorage
     */
    private addOrRemoveMovieFromLocalStorage(
        movieToWatch: FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList
    ): void {
        const moviesToWatch: Array<JoinedMovieDataCheckbox> =
            this.modifyLocalStorageService.getInfoFromLocalStorage(this.moviesFromStorageKey) || [];

        const newMoviesToWatch: Array<JoinedMovieDataCheckbox> =
            movieToWatch.type === FilmsToWatchActions.FilmsToWatchActionTypes.AddMovieToWatchList
                ? [movieToWatch.payload, ...moviesToWatch]
                : moviesToWatch.filter((movie: JoinedMovieDataCheckbox) => movie.id !== movieToWatch.payload.id);

        this.modifyLocalStorageService.setInfoToLocalStorage(this.moviesFromStorageKey, newMoviesToWatch);
    }
}
