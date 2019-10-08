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
