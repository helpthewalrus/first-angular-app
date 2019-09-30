import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppMovieSearchPageComponent } from "./app-movie-search-page/app-movie-search-page.component";
import { FilmsToWatchPageComponent } from "./films-to-watch-page/films-to-watch-page.component";

const routes: Routes = [
    { path: "", component: AppMovieSearchPageComponent },
    { path: "films-to-watch", component: FilmsToWatchPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
