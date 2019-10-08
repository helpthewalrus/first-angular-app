import { createSelector, MemoizedSelector, DefaultProjectorFn } from "@ngrx/store";

import { FilmsToWatchState } from "./films-to-watch.model";
import { JoinedMovieDataCheckbox } from "../../services/index";
import { State } from "../store.model";

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
