import { TestBed } from "@angular/core/testing";

import { MoviesHttpService } from "./movies-http.service";

describe("MoviesHttpService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: MoviesHttpService = TestBed.get(MoviesHttpService);
        expect(service).toBeTruthy();
    });
});
