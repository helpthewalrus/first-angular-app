import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { CoreModule } from "./../core/core.module";
import { SharedModule } from "../shared/shared.module";

import { AppMovieSearchPageComponent } from "./app-movie-search-page.component";
import { SearchInputComponent } from "./search-input/search-input.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { MovieListItemComponent } from "./movie-list-item/movie-list-item.component";

@NgModule({
    declarations: [AppMovieSearchPageComponent, SearchInputComponent, MovieListComponent, MovieListItemComponent],
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    providers: [],
    exports: [AppMovieSearchPageComponent]
})
export class AppMovieSearchPageModule {}
