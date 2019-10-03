import { Action } from "@ngrx/store";
import { JoinedMovieData } from "../core";

// export const resultMoviesFeatureKey = "resultMovies";

export interface State {
    resultMovies: Array<JoinedMovieData>;
}

export const initialState: State = {
    resultMovies: []
};

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        default:
            return state;
    }
}
