import { Injectable } from "@angular/core";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

import { FilmsToWatchActions } from "../store/films-to-watch/index";
import { JoinedMovieDataCheckbox } from "../services/index";
import { CommonActions } from "../store/common/index";
import { ModifyLocalStorageService } from "../services/index";

@Injectable()
export class FilmsToWatchEffects {
    private actions$: Actions;

    private modifyLocalStorageService: ModifyLocalStorageService;

    private moviesFromStorageKey = "__moviesToWatch";

    @Effect({ dispatch: false })
    public storeMoviesToWatch$: Observable<
        FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList
    >;

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
                ) => {
                    const moviesToWatch: Array<JoinedMovieDataCheckbox> =
                        this.modifyLocalStorageService.getInfoFromLocalStorage(this.moviesFromStorageKey) || [];

                    const newMoviesToWatch: Array<JoinedMovieDataCheckbox> =
                        movieToWatch.type === FilmsToWatchActions.FilmsToWatchActionTypes.AddMovieToWatchList
                            ? [movieToWatch.payload, ...moviesToWatch]
                            : moviesToWatch.filter(
                                  (movie: JoinedMovieDataCheckbox) => movie.id !== movieToWatch.payload.id
                              );

                    this.modifyLocalStorageService.setInfoToLocalStorage(this.moviesFromStorageKey, newMoviesToWatch);
                }
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
}
