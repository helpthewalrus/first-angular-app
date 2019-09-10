import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { FetchMoviesService, JoinedMovieData } from "../../core/index";

@Component({
  selector: "app-movie-list-component",
  templateUrl: "./movie-list-component.component.html",
  styleUrls: ["./movie-list-component.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponentComponent {
  private fetchMoviesService: FetchMoviesService;

  /** indicator used for loading data from server */
  public isLoading: boolean = false;

  /** observable which contains array of found movies' data */
  public resultMovies: Observable<Array<JoinedMovieData>>;

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
