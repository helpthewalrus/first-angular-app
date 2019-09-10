import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, of, zip, forkJoin, throwError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, tap, concatMap, switchMap, combineLatest, catchError, filter } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies } from "./models/index";

@Injectable()
export class FetchMoviesService {
  /** service with methods to perform HTTP-requests */
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  // CREATE OBJECT WITH FOUND DATA
  public createDataObject(movies: any, moviesInfo: any): any {
    return movies.map((movie: any, index: number) => ({
      movieId: movie.id,
      movieTitle: movie.title,
      movieOverview: movie.overview,
      movieReleaseDate: movie.release_date,
      moviePoster: movie.poster_path,
      moviesAddInfo: moviesInfo[index].credits.cast.slice(0, 5)
    }));
  }

  public fetchMovieInfo(movieId: any): any {
    return fromFetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${constants.API_KEY}&append_to_response=credits`
    ).pipe(
      switchMap((response: any) => {
        if (response.ok) {
          // OK RETURN DATA
          return response.json();
        }
        // SERVER IS RETURNING A STATUS REQUIRING THE CLIENT TO TRY SOMETHING ELSE
        return of({ error: true, message: `Error ${response.status}` });
      }),
      // NETWORK OR OTHER ERROR, HANDLE APPROPRIATELY
      catchError((err: any) => of({ error: true, message: err.message }))
    );
  }

  public parseFetchedMoviesData(movies: any): any {
    const moviesStreams: any = forkJoin(
      movies.map((movie: any) => {
        return this.fetchMovieInfo(movie.id);
      })
    );
    return moviesStreams;
  }

  /**
   * create stream to fetch movies from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public fetchMovies(movieName: string): any /* Observable<MovieData[]> */ {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("language", "en-US");
    params = params.append("query", movieName);
    params = params.append("page", "1");
    params = params.append("include_adult", "false");

    return this.http
      .get<FetchedMovies>(constants.BASE_URL, {
        params
      })
      .pipe(
        map((data: FetchedMovies) => {
          if (data.results.length > 0) {
            return data.results;
          } else {
            return [];
          }
        }),
        filter((data: any) => data.length > 0),
        concatMap(
          (movies: any) => this.parseFetchedMoviesData(movies),
          (movies: any, moviesInfo: any) => {
            return this.createDataObject(movies, moviesInfo);
          }
        ),
        map((moviesData: any) =>
          moviesData.filter((item: any) => {
            if (item.movieOverview && item.moviePoster && item.movieReleaseDate && item.movieTitle) {
              return item;
            }
          })
        )
      );
  }
}
