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

  /** indicator used for loading data from server */
  public isLoading: boolean = false;

  /**
   * indicator used for reflecting paragraph if no input provided
   */
  public noInputProvided: boolean = false;

  /**
   * observable which contains array of found movies' data
   */
  public resultMovies$: Observable<Array<JoinedMovieData>> = null;

  public currentMovie: string;

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
      this.resultMovies$ = null;
    } else {
      this.noInputProvided = false;
      this.isLoading = true;
      this.currentMovie = movieName;
      this.resultMovies$ = this.fetchMoviesService.getMoviesStream(movieName).pipe(
        tap((data: any) => console.log("from component", data)),
        tap(() => (this.isLoading = false)),
        publishReplay(1),
        refCount()
      );
    }
  }

  /**
   * search additional portion of movies on the server and put result into resultMovies variable,
   * change state of paragraph with loading state
   */
  public getNextPage(): void {
    this.isLoading = true;
    this.resultMovies$ = this.fetchMoviesService.getNextPage().pipe(
      tap((data: any) => console.log("next data", data)),
      tap(() => (this.isLoading = false))
    );
    setTimeout(() => {
      console.log(this.resultMovies$);
    }, 2000);
  }
}
