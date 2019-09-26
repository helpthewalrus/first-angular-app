import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

import { AppMovieSearchPageModule } from "./app-movie-search-page/index";
import { CoreModule } from "./core/index";
import { PipesModule } from "./shared/pipes/pipes.module";

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, FormsModule, AppMovieSearchPageModule, CoreModule, PipesModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
