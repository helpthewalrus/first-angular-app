import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";

import { initialState as filmsToWatchInitialState, filmsToWatchReducer } from "../store/index";
import { FilmsToWatchFacade } from "./films-to-watch/index";

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature("filmsToWatch", filmsToWatchReducer, {
            initialState: filmsToWatchInitialState
        })
    ],
    providers: [FilmsToWatchFacade]
})
export class FilmsToWatchStateModule {}
