import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { AppMovieSearchPageComponent } from "./app-movie-search-page.component";
import { SearchInputComponent } from "./search-input/search-input.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { MovieListItemComponent } from "./movie-list-item/movie-list-item.component";
import { PipesModule } from "./../shared/pipes/pipes.module";

@NgModule({
    declarations: [AppMovieSearchPageComponent, SearchInputComponent, MovieListComponent, MovieListItemComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatCardModule,
        MatGridListModule,
        MatProgressBarModule,
        PipesModule
    ],
    providers: [],
    exports: [AppMovieSearchPageComponent]
})
export class AppMovieSearchPageModule {}
