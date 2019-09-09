import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

import { constants } from "../../constants";

import { MovieData, FetchedMovies } from "./models/index";

@Injectable()
export class FetchMoviesService {
  /** service with methods to perform HTTP-requests */
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * create stream to fetch movies from server according to user input
   *
   * @param movieName - search input value used to fetch movies from server
   */
  public fetchMovies(movieName: string): Observable<MovieData[]> {
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
        // filter((data: FetchedMovies) => data.results.length > 0),
        map((data: FetchedMovies) => {
          if (data.results.length > 0) {
            return data.results;
          }
        })
      );
  }
}
