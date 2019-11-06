import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FetchMoviesService } from "./fetchMovies/index";
import { ModifyLocalStorageService } from "./modifyLocalStorage/index";
import { MoviesHttpService } from "./queryMoviesFacade/moviesHttp/index";
import { QueryMoviesFacadeService } from "./queryMoviesFacade/index";

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [FetchMoviesService, ModifyLocalStorageService, MoviesHttpService, QueryMoviesFacadeService]
})
export class ServicesModule {}
