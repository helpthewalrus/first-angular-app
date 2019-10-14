import { TestBed, getTestBed } from "@angular/core/testing";

import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { FetchMoviesService } from "./fetch-movies.service";
import { JoinedMovieDataCheckbox } from "./models";
import { FilmsToWatchFacade } from "../../store-facades";

describe("RestProvider", () => {
    let testBed: TestBed;

    let fetchMoviesService: FetchMoviesService;

    let httpMock: HttpTestingController;

    let facadeSpy: jasmine.SpyObj<FilmsToWatchFacade>;

    beforeEach(() => {
        const spy: any = jasmine.createSpyObj("FilmsToWatchFacade", ["filmsToWatchList$"]);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],

            providers: [FetchMoviesService, { provide: FilmsToWatchFacade, useValue: spy }]
        });

        testBed = getTestBed();

        fetchMoviesService = testBed.get(FetchMoviesService);
        facadeSpy = testBed.get(FilmsToWatchFacade);
        httpMock = testBed.get(HttpTestingController);
    });

    it("should return an Observable with array of movies data", () => {
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

        fetchMoviesService.getMoviesStream().subscribe((movies: any) => {
            expect(movies.length).toBe(1);

            expect(movies).toEqual(moviesResult);
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
