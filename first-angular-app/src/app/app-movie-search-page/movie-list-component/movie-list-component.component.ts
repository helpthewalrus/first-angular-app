import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";

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

  /** indicator used for reflecting paragraph if no input provided */
  public noInputProvided: boolean = false;

  /** observable which contains array of found movies' data */
  public resultMovies: Observable<Array<JoinedMovieData>> = null;

  constructor(fetchMoviesService: FetchMoviesService) {
    this.fetchMoviesService = fetchMoviesService;
  }

  /**
   * search movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   * change state of paragraph if no input provided
   *
   * @param movieName - input value used to search movies
   */
  public fetchMovies(movieName: string): void {
    if (!movieName.trim()) {
      this.noInputProvided = true;
      this.resultMovies = null;
    } else {
      this.noInputProvided = false;
      this.isLoading = true;

      this.resultMovies = this.fetchMoviesService.fetchMovies(movieName).pipe(tap(() => (this.isLoading = false)));
    }
  }
}
