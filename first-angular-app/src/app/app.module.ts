import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { AppComponent } from "./app.component";
import { AppMovieSearchPageModule } from "./app-movie-search-page/index";
import { FilmsToWatchPageModule } from "./films-to-watch-page/index";
import { CoreModule } from "./core/index";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { reducers, metaReducers } from "./reducers";
import { environment } from "../environments/environment";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        AppMovieSearchPageModule,
        FilmsToWatchPageModule,
        StoreModule.forRoot(reducers, {
            metaReducers
            // runtimeChecks: {
            //     strictStateImmutability: true,
            //     strictActionImmutability: true
            // }
        }),
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
