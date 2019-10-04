import { Action } from "@ngrx/store";

import { JoinedMovieDataCheckbox } from "../../index";

/**
 * AddMovieToWatchList - stands for adding movie to watch list action
 * RemoveMovieToWatchList - stands for removing movie from watch list action
 */
export enum FilmsToWatchActionTypes {
    AddMovieToWatchList = "[FilmsToWatch] Add Movie To Watch List",
    RemoveMovieToWatchList = "[FilmsToWatch] Remove Movie From Watch List"
}

export class AddMovieToWatchList implements Action {
    public readonly type = FilmsToWatchActionTypes.AddMovieToWatchList;

    constructor(public payload: JoinedMovieDataCheckbox) {}
}

export class RemoveMovieToWatchList implements Action {
    public readonly type = FilmsToWatchActionTypes.RemoveMovieToWatchList;

    constructor(public payload: JoinedMovieDataCheckbox) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FilmsToWatchActions = AddMovieToWatchList | RemoveMovieToWatchList;
