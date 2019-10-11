import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FetchMoviesService } from "./fetchMovies/index";
import { ModifyLocalStorageService } from "./modifyLocalStorage/index";

@NgModule({
    declarations: [],
    imports: [CommonModule, HttpClientModule],
    providers: [FetchMoviesService, ModifyLocalStorageService]
})
export class ServicesModule {}
