import { NgModule, APP_INITIALIZER } from "@angular/core";

import { StoreModule, Store } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../../environments/environment";
import { reducers, metaReducers } from "./store/reducers";
import { ServicesModule } from "./services/index";
import { StoreFacadeModule } from "./store-facades/index";
import { effects } from "./effects/index";
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
        EffectsModule.forRoot(effects)
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (store: Store<State>): (() => void) => {
                return (): void => {
                    store.dispatch(new CommonActions.Initialize());
                };
            },
            multi: true,
            deps: [Store]
        }
    ],
    exports: [ServicesModule]
})
export class CoreModule {}
