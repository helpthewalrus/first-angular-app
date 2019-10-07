import { NgModule } from "@angular/core";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "../../environments/environment";
import { reducers, metaReducers } from "./store/reducers";
import { ServicesModule } from "./services/index";
import { FilmsToWatchStateModule } from "./store-facades/index";

@NgModule({
    declarations: [],
    imports: [
        ServicesModule,
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        FilmsToWatchStateModule
    ],
    exports: [ServicesModule]
})
export class CoreModule {}
