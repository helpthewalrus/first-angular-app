import { NgModule, APP_INITIALIZER } from "@angular/core";

import { StoreModule, Store } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../../environments/environment";
import { reducers, metaReducers } from "./store/reducers";
import { ServicesModule } from "./services/index";
import { StoreFacadeModule } from "./store-facades/index";
import { FilmsToWatchEffects } from "./effects/films-to-watch.effects";
import { State } from "./store/index";
import { CommonActions } from "./store/common/index";

@NgModule({
    declarations: [],
    imports: [
        ServicesModule,
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreFacadeModule,
        EffectsModule.forRoot([FilmsToWatchEffects])
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (store: Store<State>): (() => void) => {
                return (): void => {
                    store.dispatch(new CommonActions.INITIALIZE());
                };
            },
            multi: true,
            deps: [Store]
        }
    ],
    exports: [ServicesModule]
})
export class CoreModule {}
