import { buildMoviesWithChosenInfo } from "./build-movies-with-chosen-info.utility";

import { AdditionalMovieData, JoinedMovieData } from "../../services/index";

describe("buildMoviesWithChosenInfo", () => {
    it("should return empty array if no data provided in source array", () => {
        const result: Array<JoinedMovieData> = buildMoviesWithChosenInfo([]);
        expect(result).toEqual([]);
    });

    it("should return JoinedMovieData array if source array contains AdditionalMovieData", () => {
        const inputObject: Array<AdditionalMovieData> = [
            {
                credits: {
                    cast: [
                        {
                            cast_id: 200,
                            character: "test_character",
                            credit_id: "test_credit_id",
                            gender: 300,
                            id: 400,
                            name: "test_name",
                            order: 500,
                            profile_path: "test_profile_path"
                        }
                    ],
                    crew: []
                },
                id: 600,
                overview: "test_overview",
                poster_path: "test_poster_path",
                release_date: "1997-11-18",
                title: "test_title"
            }
        ];

        const resultObject: Array<JoinedMovieData> = [
            {
                addInfo: [
                    {
                        cast_id: 200,
                        character: "test_character",
                        credit_id: "test_credit_id",
                        gender: 300,
                        id: 400,
                        name: "test_name",
                        order: 500,
                        profile_path: "test_profile_path"
                    }
                ],
                id: 600,
                overview: "test_overview",
                poster: "test_poster_path",
                releaseDate: "1997-11-18",
                title: "test_title"
            }
        ];

        const result: Array<JoinedMovieData> = buildMoviesWithChosenInfo(inputObject);

        expect(result).toEqual(resultObject);
    });
});
