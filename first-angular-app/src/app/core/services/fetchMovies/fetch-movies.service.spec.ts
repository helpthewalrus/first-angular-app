import { TestBed } from "@angular/core/testing";

import { FetchMoviesService } from "./fetch-movies.service";
import { JoinedMovieDataCheckbox, FetchedMovies, AdditionalMovieData } from "./models/index";
import { FilmsToWatchFacade } from "../../store-facades";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { RunHelpers } from "rxjs/internal/testing/TestScheduler";
import * as Utils from "../../utilities/index";
import { constants } from "../../constants";

fdescribe("FetchMoviesService", () => {
    let fetchMoviesService: FetchMoviesService;
    let testScheduler: TestScheduler;

    const httpMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj("HttpClient", ["get"]);

    const filmsToWatchFacadeMock: jasmine.SpyObj<FilmsToWatchFacade> = jasmine.createSpyObj("FilmsToWatchFacade", [
        "filmsToWatchList$"
    ]);
    const filmsToWatchListSubj: BehaviorSubject<Array<JoinedMovieDataCheckbox>> = new BehaviorSubject(undefined);
    filmsToWatchFacadeMock.filmsToWatchList$ = filmsToWatchListSubj.asObservable();

    const fetchedMovies: FetchedMovies = {
        page: 1,
        total_results: 1,
        total_pages: 1,
        results: [
            {
                id: 597,
                overview: "overview",
                poster_path: "poster",
                release_date: "2010-01-01",
                title: "Titanic"
            }
        ]
    };

    const additionalInfo: AdditionalMovieData = {
        credits: {
            cast: [
                {
                    id: 100,
                    name: "John Doe",
                    order: 200,
                    profile_path: "test_profile_path"
                }
            ]
        },
        id: 597,
        overview: "overview",
        poster_path: "poster",
        release_date: "2010-01-01",
        title: "Titanic"
    };

    const moviesResult: Array<JoinedMovieDataCheckbox> = [
        {
            isAddedToWatchList: false,
            id: 597,
            overview: "overview",
            poster: "poster",
            releaseDate: "2010-01-01",
            title: "Titanic",
            addInfo: [
                {
                    id: 100,
                    name: "John Doe",
                    order: 200,
                    profile_path: "test_profile_path"
                }
            ]
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FetchMoviesService,
                { provide: FilmsToWatchFacade, useValue: filmsToWatchFacadeMock },
                { provide: HttpClient, useValue: httpMock }
            ]
        });
        testScheduler = new TestScheduler((actual: any, expected: any): any => expect(actual).toEqual(expected));
        fetchMoviesService = TestBed.get(FetchMoviesService);
    });

    it("should return an Observable with array of movies data", () => {
        testScheduler.run((helpers: RunHelpers) => {
            fetchMoviesService.fetchMovies("Test");

            httpMock.get.and.callFake(
                (a: any, b: any): Observable<any> => {
                    if (a.includes(fetchedMovies.results[0].id)) {
                        return of(additionalInfo);
                    } else {
                        return of(fetchedMovies);
                    }
                }
            );
            filmsToWatchListSubj.next([]);

            helpers
                .expectObservable(fetchMoviesService.getMoviesStream(), "^ 15s !")
                .toBe("0ms a", { a: moviesResult });
        });
    });
});
