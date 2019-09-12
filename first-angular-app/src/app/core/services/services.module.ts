import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FetchMoviesService } from "./fetchMovies";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FetchMoviesService]
})
export class ServicesModule {}
