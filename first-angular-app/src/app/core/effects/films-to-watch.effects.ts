import { Injectable } from "@angular/core";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

import { FilmsToWatchActions } from "../store/films-to-watch/index";
import { JoinedMovieDataCheckbox } from "../services/index";
import { CommonActions } from "../store/common/index";
import { constants } from "../constants";

@Injectable()
export class FilmsToWatchEffects {
    @Effect({ dispatch: false })
    public storeMoviesToWatch$: Observable<
        FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList
    > = this.actions$.pipe(
        ofType(
            FilmsToWatchActions.FilmsToWatchActionTypes.AddMovieToWatchList,
            FilmsToWatchActions.FilmsToWatchActionTypes.RemoveMovieFromWatchList
        ),
        tap((movieToWatch: FilmsToWatchActions.AddMovieToWatchList | FilmsToWatchActions.RemoveMovieFromWatchList) => {
            const storedMoviesToWatch: string = localStorage.getItem(constants.MOVIES_FROM_LOCALSTORAGE);

            const moviesToWatch: Array<JoinedMovieDataCheckbox> = storedMoviesToWatch
                ? JSON.parse(storedMoviesToWatch)
                : [];

            const newMoviesToWatch: Array<JoinedMovieDataCheckbox> =
                movieToWatch.type === FilmsToWatchActions.FilmsToWatchActionTypes.AddMovieToWatchList
                    ? [movieToWatch.payload, ...moviesToWatch]
                    : moviesToWatch.filter((movie: JoinedMovieDataCheckbox) => movie.id !== movieToWatch.payload.id);

            localStorage.setItem(constants.MOVIES_FROM_LOCALSTORAGE, JSON.stringify(newMoviesToWatch));
        })
    );

    @Effect()
    public getMoviesToWatch$: Observable<FilmsToWatchActions.GetMoviesToWatchSuccess> = this.actions$.pipe(
        ofType(CommonActions.CommonActionTypes.Initialize),
        map(() => {
            const storedMoviesToWatch: string = localStorage.getItem(constants.MOVIES_FROM_LOCALSTORAGE);

            const moviesToWatch: Array<JoinedMovieDataCheckbox> = storedMoviesToWatch
                ? JSON.parse(storedMoviesToWatch)
                : [];

            return new FilmsToWatchActions.GetMoviesToWatchSuccess(moviesToWatch);
        })
    );

    constructor(private actions$: Actions) {}
}
