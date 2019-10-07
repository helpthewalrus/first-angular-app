import { createSelector, MemoizedSelector, DefaultProjectorFn } from "@ngrx/store";

import { FilmsToWatchState } from "./films-to-watch.reducer";
import { State, JoinedMovieDataCheckbox } from "../../../core/index";

export const selectFilmsToWatchState: (state: State) => FilmsToWatchState = (state: State): FilmsToWatchState => {
    return state.filmsToWatch;
};

export const selectFilmsToWatchList: MemoizedSelector<
    State,
    Array<JoinedMovieDataCheckbox>,
    DefaultProjectorFn<Array<JoinedMovieDataCheckbox>>
> = createSelector(
    selectFilmsToWatchState,
    (state: FilmsToWatchState) => state.filmsToWatch
);
