import { JoinedMovieDataCheckbox } from "../../services/index";
import { FilmsToWatchActionTypes, FilmsToWatchActions } from "./films-to-watch.actions";
import { FilmsToWatchState } from "./films-to-watch.model";

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
                filmsToWatch: [action.payload, ...state.filmsToWatch]
            };
        case FilmsToWatchActionTypes.RemoveMovieFromWatchList:
            return {
                ...state,
                filmsToWatch: state.filmsToWatch.filter((filmToWatch: JoinedMovieDataCheckbox) => {
                    return filmToWatch.id !== action.payload.id;
                })
            };
        case FilmsToWatchActionTypes.GetMoviesToWatchSuccess:
            return {
                ...state,
                filmsToWatch: [...action.payload, ...state.filmsToWatch]
            };
        default:
            return state;
    }
}
