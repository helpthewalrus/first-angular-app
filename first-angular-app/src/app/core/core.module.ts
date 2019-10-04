import { NgModule } from "@angular/core";

import { ServicesModule } from "./services/services.module";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./store/reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../../environments/environment";

@NgModule({
    declarations: [],
    imports: [
        ServicesModule,
        StoreModule.forRoot(reducers, {
            metaReducers
            // runtimeChecks: {
            //     strictStateImmutability: true,
            //     strictActionImmutability: true
            // }
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    exports: [ServicesModule]
})
export class CoreModule {}
