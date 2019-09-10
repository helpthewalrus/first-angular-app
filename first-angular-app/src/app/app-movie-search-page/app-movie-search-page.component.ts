import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { FetchMoviesService, MovieData } from "../core/index";

@Component({
  selector: "app-app-movie-search-page",
  templateUrl: "./app-movie-search-page.component.html",
  styleUrls: ["./app-movie-search-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent {
  private fetchMoviesService: FetchMoviesService;

  /** indicator used for loading data from server */
  public isLoading: boolean = false;

  /** observable which contains array of found mouvies' data */
  public resultMovies: Observable<Array<MovieData>>;

  constructor(fetchMoviesService: FetchMoviesService) {
    this.fetchMoviesService = fetchMoviesService;
  }

  /**
   * search movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   *
   * @param movieName - input value used to search movies
   */
  public fetchMovies(movieName: string): void {
    this.isLoading = true;
    this.resultMovies = this.fetchMoviesService.fetchMovies(movieName).pipe(tap(() => (this.isLoading = false)));
  }
}
