import { createSelector } from "@ngrx/store";

import { State } from "../reducers";
import { FilmsToWatchState } from "./films-to-watch.reducer";

export const selectFilmsToWatchState: any = (state: State): any => state.filmsToWatch;

export const selectFilmsToWatchList: any = createSelector(
    selectFilmsToWatchState,
    (state: FilmsToWatchState) => state.filmsToWatch
);
