import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";

import { FetchedMovies, AdditionalMovieData } from "../../fetchMovies/index";
import { constants } from "../../../constants";

@Injectable()
export class MoviesHttpService {
    /**
     * Service with methods to perform HTTP-requests
     */
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public getMovies(movieName: string, pageNumber: number): Observable<FetchedMovies> {
        let params: HttpParams = new HttpParams();
        params = params.append("api_key", constants.API_KEY);
        params = params.append("language", "en-US");
        params = params.append("query", movieName);
        params = params.append("page", `${pageNumber}`);
        params = params.append("include_adult", "false");

        return this.http.get<FetchedMovies>(constants.BASE_URL, { params });
    }

    public getMovieDetails(movieId: number): Observable<any> {
        let params: HttpParams = new HttpParams();
        params = params.append("api_key", constants.API_KEY);
        params = params.append("append_to_response", "credits");

        return this.http.get(`${constants.MOVIE_INFO_URL}${movieId}`, { params }) as Observable<AdditionalMovieData>;
    }
}
