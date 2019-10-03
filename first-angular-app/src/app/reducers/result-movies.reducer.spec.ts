import { reducer, initialState } from "./result-movies.reducer";

describe("ResultMovies Reducer", () => {
    describe("an unknown action", () => {
        it("should return the previous state", () => {
            const action: any = {} as any;

            const result: any = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });
});
