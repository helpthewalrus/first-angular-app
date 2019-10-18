import { TestBed } from "@angular/core/testing";

import { FetchMoviesService } from "./fetch-movies.service";
import { JoinedMovieDataCheckbox, FetchedMovies, AdditionalMovieData, JoinedMovieData } from "./models/index";
import { FilmsToWatchFacade } from "../../store-facades";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
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

    const fetchedMoviesFirstPage: FetchedMovies = {
        page: 1,
        total_results: 2,
        total_pages: 2,
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

    const additionalInfoFirstPage: AdditionalMovieData = {
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

    const joinedInfoFirstPage: Array<JoinedMovieData> = [
        {
            addInfo: [
                {
                    id: 100,
                    name: "John Doe",
                    order: 200,
                    profile_path: "test_profile_path"
                }
            ],
            id: 597,
            overview: "overview",
            poster: "poster",
            releaseDate: "2010-01-01",
            title: "Titanic"
        }
    ];

    const moviesResultFirstPage: Array<JoinedMovieDataCheckbox> = [
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

    const fetchedMoviesSecondPage: FetchedMovies = {
        page: 2,
        total_results: 2,
        total_pages: 2,
        results: [
            {
                id: 600,
                overview: "overview_page2",
                poster_path: "poster_page2",
                release_date: "2020-02-02",
                title: "Titanic_page2"
            }
        ]
    };

    const additionalInfoSecondPage: AdditionalMovieData = {
        credits: {
            cast: [
                {
                    id: 200,
                    name: "John Doe Junior",
                    order: 300,
                    profile_path: "test_profile_path_page2"
                }
            ]
        },
        id: 600,
        overview: "overview_page2",
        poster_path: "poster_page2",
        release_date: "2020-02-02",
        title: "Titanic_page2"
    };

    const moviesResultSecondPage: Array<JoinedMovieDataCheckbox> = [
        {
            isAddedToWatchList: false,
            id: 600,
            overview: "overview_page2",
            poster: "poster_page2",
            releaseDate: "2020-02-02",
            title: "Titanic_page2",
            addInfo: [
                {
                    id: 200,
                    name: "John Doe Junior",
                    order: 300,
                    profile_path: "test_profile_path_page2"
                }
            ]
        }
    ];

    const joinedInfoSecondPage: Array<JoinedMovieData> = [
        {
            addInfo: [
                {
                    id: 200,
                    name: "John Doe Junior",
                    order: 300,
                    profile_path: "test_profile_path_page2"
                }
            ],
            id: 600,
            overview: "overview_page2",
            poster: "poster_page2",
            releaseDate: "2020-02-02",
            title: "Titanic_page2"
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

    it("should return an Observable with array of movies data from first page (fetchMovies)", () => {
        testScheduler.run((helpers: RunHelpers) => {
            httpMock.get.and.callFake(
                (a: string): Observable<any> => {
                    if (a.includes(fetchedMoviesFirstPage.results[0].id.toString())) {
                        return of(additionalInfoFirstPage) as Observable<AdditionalMovieData>;
                    } else {
                        return of(fetchedMoviesFirstPage) as Observable<FetchedMovies>;
                    }
                }
            );

            filmsToWatchListSubj.next([]);

            const querySubject: Observable<
                Array<JoinedMovieDataCheckbox | string>
            > = fetchMoviesService.getMoviesStream();

            fetchMoviesService.fetchMovies("Test");

            helpers.expectObservable(querySubject, "15s !").toBe("a", { a: moviesResultFirstPage });
        });
    });

    it("should return an Observable with array of movies data from the second page (getNextPage)", () => {
        testScheduler.run((helpers: RunHelpers) => {
            let counter: number = 1;

            httpMock.get.and.callFake(
                (a: string): Observable<any> => {
                    if (counter === 1) {
                        if (a.includes(fetchedMoviesFirstPage.results[0].id.toString())) {
                            counter++;
                            return of(additionalInfoFirstPage) as Observable<AdditionalMovieData>;
                        }
                        return of(fetchedMoviesFirstPage) as Observable<FetchedMovies>;
                    } else if (counter === 2) {
                        if (a.includes(fetchedMoviesSecondPage.results[0].id.toString())) {
                            return of(additionalInfoSecondPage) as Observable<AdditionalMovieData>;
                        }
                        return of(fetchedMoviesSecondPage) as Observable<FetchedMovies>;
                    }
                }
            );
            filmsToWatchListSubj.next([]);

            const querySubject: Observable<
                Array<JoinedMovieDataCheckbox | string>
            > = fetchMoviesService.getMoviesStream();

            const dateSpy: jasmine.Spy<() => number> = spyOn(Date, "now");

            dateSpy.and.returnValue(10001);
            fetchMoviesService.fetchMovies("Test");

            helpers.expectObservable(querySubject, "15s !").toBe("a", { a: moviesResultFirstPage });

            dateSpy.and.returnValue(20001);
            fetchMoviesService.getNextPage();

            helpers.expectObservable(querySubject, "15s !").toBe("a", { a: moviesResultSecondPage });
        });
    });

    it("should return an Observable with 'No movies found'", () => {
        const fetchNoMovies: FetchedMovies = {
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: []
        };

        const result: Array<string> = [constants.NO_MOVIES_FOUND];

        testScheduler.run((helpers: RunHelpers) => {
            httpMock.get.and.returnValue(of(fetchNoMovies) as Observable<FetchedMovies>);

            filmsToWatchListSubj.next([]);

            const querySubject: Observable<
                Array<JoinedMovieDataCheckbox | string>
            > = fetchMoviesService.getMoviesStream();

            fetchMoviesService.fetchMovies("Test");

            helpers.expectObservable(querySubject, "15s !").toBe("a", { a: result });
        });
    });

    it("should return an Observable with array of chosen previously movies", () => {
        const chosenMovies: Array<JoinedMovieDataCheckbox> = [
            {
                isAddedToWatchList: true,
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

        testScheduler.run((helpers: RunHelpers) => {
            httpMock.get.and.callFake(
                (a: string): Observable<any> => {
                    if (a.includes(fetchedMoviesFirstPage.results[0].id.toString())) {
                        return of(additionalInfoFirstPage) as Observable<AdditionalMovieData>;
                    } else {
                        return of(fetchedMoviesFirstPage) as Observable<FetchedMovies>;
                    }
                }
            );

            filmsToWatchListSubj.next(chosenMovies);

            const querySubject: Observable<
                Array<JoinedMovieDataCheckbox | string>
            > = fetchMoviesService.getMoviesStream();

            fetchMoviesService.fetchMovies("Test");

            helpers.expectObservable(querySubject, "15s !").toBe("a", { a: chosenMovies });
        });
    });
});
