import { TestBed } from "@angular/core/testing";

import { QueryMoviesFacadeService } from "./query-movies-facade.service";

describe("QueryMoviesFacadeService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: QueryMoviesFacadeService = TestBed.get(QueryMoviesFacadeService);
        expect(service).toBeTruthy();
    });
});
