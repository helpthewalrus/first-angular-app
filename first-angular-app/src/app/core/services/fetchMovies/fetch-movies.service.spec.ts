import { TestBed, getTestBed } from "@angular/core/testing";

import { FetchMoviesService } from "./fetch-movies.service";
import { JoinedMovieDataCheckbox } from "./models";
import { FilmsToWatchFacade } from "../../store-facades";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { RunHelpers } from "rxjs/internal/testing/TestScheduler";
import * as Utils from "../../utilities/index";

describe("RestProvider", () => {
    let fetchMoviesService: FetchMoviesService;
    let testScheduler: TestScheduler;

    const httpMock: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj("HttpClient", ["get"]);
    const filmsToWatchListSubj: BehaviorSubject<Array<JoinedMovieDataCheckbox>> = new BehaviorSubject(undefined);
    const filmsToWatchFacadeMock: jasmine.SpyObj<FilmsToWatchFacade> = jasmine.createSpyObj("FilmsToWatchFacade", [
        "filmsToWatchList$"
    ]);
    filmsToWatchFacadeMock.filmsToWatchList$ = filmsToWatchListSubj.asObservable();

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

    fit("should return an Observable with array of movies data", () => {
        testScheduler.run((helpers: RunHelpers) => {
            const moviesResult: Array<JoinedMovieDataCheckbox> = [
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
            // spyOn(Utils, "joinedMovieObject").and.returnValue();
            // httpMock.get.and.callFake(params => {
            //     // if fetch list return of(fakeList)
            //     // else return of movieInfo
            // });
            helpers.expectObservable(fetchMoviesService.getMoviesStream(), "15s !").toBe("10s a", { a: moviesResult });
        });
    });

    it("should return an Observable with array of movies data searched by movie name", () => {
        const moviesResult: Array<JoinedMovieDataCheckbox> = [
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

        fetchMoviesService.fetchMovies("Titanic");
        fetchMoviesService.getMoviesStream().subscribe((movies: any) => {
            expect(movies.length).toBe(1);

            expect(movies).toEqual(moviesResult);
        });
    });
});
