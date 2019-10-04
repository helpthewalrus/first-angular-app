import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from "@ngrx/store";
import { environment } from "../../../environments/environment";
import { FilmsToWatchState, filmsToWatchReducer } from "./films-to-watch/films-to-watch.reducer";

export interface State {
    filmsToWatch: FilmsToWatchState;
}

export const reducers: ActionReducerMap<State> = {
    filmsToWatch: filmsToWatchReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectFilmsToWatchState: any = (state: State): any => state.filmsToWatch;

export const selectFilmsToWatchList: any = createSelector(
    selectFilmsToWatchState,
    (state: FilmsToWatchState) => state.filmsToWatch
);
