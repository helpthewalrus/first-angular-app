import { Action } from "@ngrx/store";

import { JoinedMovieDataCheckbox } from "../../services/index";

/**
 * AddMovieToWatchList - stands for adding movie to watch list action
 * RemoveMovieToWatchList - stands for removing movie from watch list action
 */
export enum FilmsToWatchActionTypes {
    AddMovieToWatchList = "[FilmsToWatch] Add Movie To Watch List",
    RemoveMovieToWatchList = "[FilmsToWatch] Remove Movie From Watch List"
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

    public readonly type = FilmsToWatchActionTypes.RemoveMovieToWatchList;

    constructor(payload: JoinedMovieDataCheckbox) {
        this.payload = payload;
    }
}

export type FilmsToWatchActions = AddMovieToWatchList | RemoveMovieFromWatchList;
