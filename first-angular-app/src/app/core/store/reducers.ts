import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from "@ngrx/store";

import { environment } from "../../../environments/environment";
import { filmsToWatchReducer } from "./films-to-watch/index";
import { State } from "./store.model";

export const reducers: ActionReducerMap<State> = {
    filmsToWatch: filmsToWatchReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
