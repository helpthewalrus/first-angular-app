import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { FetchMoviesService, MovieDataInterface } from "../core/index";

@Component({
  selector: "app-app-movie-search-page",
  templateUrl: "./app-movie-search-page.component.html",
  styleUrls: ["./app-movie-search-page.component.scss"],
  providers: [FetchMoviesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent {
  /** indicator used for loading data from server */
  public isLoading: boolean = false;

  /** observable which contains array of found mouvies' data */
  public resultMovies: Observable<MovieDataInterface[]>;

  /** service used to fetch data about movies from server */
  private fetchMoviesService: FetchMoviesService;

  constructor(fetchMoviesService: FetchMoviesService) {
    this.fetchMoviesService = fetchMoviesService;
  }

  /**
   * search movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   *
   * @param movieName - input value used to search movies
   */
  public fetchMoviesTitles(movieName: string): void {
    this.isLoading = true;
    this.resultMovies = this.fetchMoviesService.fetchMovies(movieName).pipe(tap(() => (this.isLoading = false)));
  }
}
