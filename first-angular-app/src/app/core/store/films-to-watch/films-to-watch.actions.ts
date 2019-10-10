import { Action } from "@ngrx/store";

import { JoinedMovieDataCheckbox } from "../../services/index";

/**
 * AddMovieToWatchList - stands for adding movie to watch list action
 * RemoveMovieToWatchList - stands for removing movie from watch list action
 * GetMoviesToWatchSuccess - stands for updating store with data saved in localStorage
 */
export enum FilmsToWatchActionTypes {
    AddMovieToWatchList = "[FilmsToWatch] ADD MOVIE TO WATCHLIST",
    RemoveMovieFromWatchList = "[FilmsToWatch] REMOVE MOVIE FROM WATCHLIST",
    GetMoviesToWatchSuccess = "[FilmsToWatch] GET MOVIES TO WATCH SUCCESS"
}

export class AddMovieToWatchList implements Action {
    public payload: JoinedMovieDataCheckbox;

    public readonly type = FilmsToWatchActionTypes.AddMovieToWatchList;

    constructor(payload: JoinedMovieDataCheckbox) {
        this.payload = payload;
    }
}

export class RemoveMovieFromWatchList implements Action {
    public payload: JoinedMovieDataCheckbox;

    public readonly type = FilmsToWatchActionTypes.RemoveMovieFromWatchList;

    constructor(payload: JoinedMovieDataCheckbox) {
        this.payload = payload;
    }
}

export class GetMoviesToWatchSuccess implements Action {
    public payload: Array<JoinedMovieDataCheckbox>;

    public readonly type = FilmsToWatchActionTypes.GetMoviesToWatchSuccess;

    constructor(payload: Array<JoinedMovieDataCheckbox>) {
        this.payload = payload;
    }
}

export type FilmsToWatchActions = AddMovieToWatchList | RemoveMovieFromWatchList | GetMoviesToWatchSuccess;
