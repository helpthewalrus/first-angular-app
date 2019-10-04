import { Action } from "@ngrx/store";

import { JoinedMovieDataCheckbox } from "../../index";
import { FilmsToWatchActionTypes, FilmsToWatchActions } from "./films-to-watch.actions";

export const filmsToWatchFeatureKey: string = "filmsToWatch";

export interface FilmsToWatchState {
    filmsToWatch: Array<JoinedMovieDataCheckbox>;
}

export const initialState: FilmsToWatchState = {
    filmsToWatch: []
};

export function filmsToWatchReducer(
    state: FilmsToWatchState = initialState,
    action: FilmsToWatchActions
): FilmsToWatchState {
    switch (action.type) {
        case FilmsToWatchActionTypes.AddMovieToWatchList:
            return {
                ...state,
                filmsToWatch: [...state.filmsToWatch, action.payload]
            };
        case FilmsToWatchActionTypes.RemoveMovieToWatchList:
            return {
                ...state,
                filmsToWatch: state.filmsToWatch.filter((filmToWatch: JoinedMovieDataCheckbox) => {
                    return filmToWatch.joinedMovieData.id !== action.payload.joinedMovieData.id;
                })
            };
        default:
            return state;
    }
}
