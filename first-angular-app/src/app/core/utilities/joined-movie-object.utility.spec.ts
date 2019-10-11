import { joinedMovieObject } from "./joined-movie-object.utility";

import { AdditionalMovieData, JoinedMovieData } from "../services/index";

describe("joinedMovieObject", () => {
    it("should return empty array if no data provided in source array", () => {
        const result: Array<JoinedMovieData> = joinedMovieObject([]);
        expect(result).toEqual([]);
    });

    it("should return JoinedMovieData array if source array contains AdditionalMovieData", () => {
        const inputObject: Array<AdditionalMovieData> = [
            {
                adult: false,
                backdrop_path: "test_backdrop_path",
                belongs_to_collection: null,
                budget: 100,
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
                genres: [{ id: 18, name: "Drama" }],
                homepage: null,
                id: 600,
                imdb_id: "test_imdb_id",
                original_language: "test_original_language",
                original_title: "test_original_title",
                overview: "test_overview",
                popularity: 700,
                poster_path: "test_poster_path",
                production_companies: [
                    { id: 4, logo_path: "test_logo_path", name: "test_name", origin_country: "test_origin_country" }
                ],
                release_date: "1997-11-18",
                revenue: 800,
                runtime: 900,
                spoken_languages: [],
                status: "test_status",
                tagline: "test_tagline",
                title: "test_title",
                video: false,
                vote_average: 1000,
                vote_count: 1100
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

        const result: Array<JoinedMovieData> = joinedMovieObject(inputObject);

        expect(result).toEqual(resultObject);
    });
});
