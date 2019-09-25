import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";

import { Observable } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";

import { FetchMoviesService, JoinedMovieData } from "../core/index";
@Component({
  selector: "app-app-movie-search-page",
  templateUrl: "./app-movie-search-page.component.html",
  styleUrls: ["./app-movie-search-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMovieSearchPageComponent implements OnInit {
  private fetchMoviesService: FetchMoviesService;

  /** Indicator used for loading data from server */
  public isLoading: boolean = false;

  public isMovieListHidden: boolean = false;

  /**
   * Indicator used for reflecting paragraph if no input provided
   */
  public noInputProvided: boolean = false;

  /**
   * Observable which contains array of found movies' data
   */
  public resultMovies$: Observable<Array<JoinedMovieData | string>> = null;

  /**
   * Store current searched movie name
   */
  public currentMovie: string;

  /**
   * Stores boolean value whether user is on last page of searched movie
   */
  public isLastPage: boolean = false;

  constructor(fetchMoviesService: FetchMoviesService) {
    this.fetchMoviesService = fetchMoviesService;
  }

  public ngOnInit(): void {
    this.resultMovies$ = this.fetchMoviesService.getMoviesStream().pipe(
      shareReplay(1),
      tap(() => (this.isLoading = false)),
      tap(() => (this.isMovieListHidden = false))
    );
  }

  /**
   * Search movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   * change state of paragraph if no input provided
   *
   * @param movieName - input value used to search movies
   */
  public fetchMovies(movieName: string): void {
    if (movieName.length) {
      this.isLastPage = false;
      this.isLoading = true;
      this.isMovieListHidden = true;

      this.fetchMoviesService.fetchMovies(movieName);
      this.isLastPage = this.fetchMoviesService.isLastPage;
    }
  }

  /**
   * Search additional portion of movies on the server and result is reflected in resultMovies variable,
   * change state of paragraph with loading state
   */
  public getNextPage(): void {
    this.isLoading = true;

    this.fetchMoviesService.getNextPage();
    this.isLastPage = this.fetchMoviesService.isLastPage;
  }

  /**
   * Checks whether provided value is string or not
   *
   * @param value - checked value
   */
  public isString(value: any): boolean {
    return typeof value === "string";
  }
}
