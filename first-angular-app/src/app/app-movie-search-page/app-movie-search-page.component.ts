import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Observable, interval } from "rxjs";
import { tap, take, map, publishReplay, refCount } from "rxjs/operators";

import { FetchMoviesService, JoinedMovieData } from "../core/index";
@Component({
  selector: "app-app-movie-search-page",
  templateUrl: "./app-movie-search-page.component.html",
  styleUrls: ["./app-movie-search-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent {
  private fetchMoviesService: FetchMoviesService;

  /** Indicator used for loading data from server */
  public isLoading: boolean = false;

  /**
   * Indicator used for reflecting paragraph if no input provided
   */
  public noInputProvided: boolean = false;

  /**
   * Observable which contains array of found movies' data
   */
  public resultMovies$: Observable<Array<JoinedMovieData>> = null;

  /**
   * Store current searched movie name
   */
  public currentMovie: string;

  constructor(fetchMoviesService: FetchMoviesService) {
    this.fetchMoviesService = fetchMoviesService;
  }

  /**
   * Search movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   * change state of paragraph if no input provided
   *
   * @param movieName - input value used to search movies
   */
  public fetchMovies(movieName: string): void {
    if (!movieName.trim()) {
      this.noInputProvided = true;
      this.resultMovies$ = null;
    } else {
      this.noInputProvided = false;
      this.isLoading = true;
      this.currentMovie = movieName;
      this.resultMovies$ = this.fetchMoviesService.getMoviesStream(movieName).pipe(
        tap(() => (this.isLoading = false)),
        publishReplay(1),
        refCount()
      );
    }
  }

  /**
   * Search additional portion of movies on the server and result is reflected in resultMovies variable,
   * change state of paragraph with loading state
   */
  public getNextPage(): void {
    this.isLoading = true;
    this.fetchMoviesService.getNextPage();
  }
}
