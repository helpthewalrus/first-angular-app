import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from "@ngrx/store";

import { environment } from "../../../environments/environment";
import { FilmsToWatchState, filmsToWatchReducer } from "./films-to-watch/index";

export interface State {
    filmsToWatch: FilmsToWatchState;
}

export const reducers: ActionReducerMap<State> = {
    filmsToWatch: filmsToWatchReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
