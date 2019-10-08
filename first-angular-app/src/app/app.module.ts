import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AppMovieSearchPageModule } from "./app-movie-search-page/index";
import { FilmsToWatchPageModule } from "./films-to-watch-page/index";
import { CoreModule } from "./core/index";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";

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
        FilmsToWatchPageModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
