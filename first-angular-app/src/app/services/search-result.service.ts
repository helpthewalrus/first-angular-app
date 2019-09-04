import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { delay, tap, map } from "rxjs/operators";
import { constants } from "../constants";

export interface SearchResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: any;
}

@Injectable({
  providedIn: "root"
})
export class SearchResultService {
  constructor(private http: HttpClient) {}

  public fetchMoviesTitles(movieName: string): Observable<SearchResult> {
    let params: HttpParams = new HttpParams();
    params = params.append("api_key", constants.API_KEY);
    params = params.append("language", "en-US");
    params = params.append("query", movieName);
    params = params.append("page", "1");
    params = params.append("include_adult", "false");

    return this.http
      .get<SearchResult>("https://api.themoviedb.org/3/search/movie", {
        params
      })
      .pipe(
        delay(500),
        map((data: SearchResult) => {
          return data.results.map((item: any) => item.title).filter((item: object, index: number) => index < 10);
        })
      );
  }
}
