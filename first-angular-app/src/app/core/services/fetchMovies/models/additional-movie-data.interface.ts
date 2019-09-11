import { MovieCastData } from "./movie-cast-data";
import { MovieGenres } from "./movie-genres.interface";
import { ProductionCompanies } from "./production-companies.interface";
import { SpokenLanguages } from "./spoken-languages.interface";

export interface AdditionalMovieData {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: null;
  budget?: number;
  credits: { cast: Array<MovieCastData>; crew?: Array<any> };
  genres?: Array<MovieGenres>;
  homepage?: null;
  id: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity?: number;
  poster_path: string;
  production_companies?: Array<ProductionCompanies>;
  release_date: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: Array<SpokenLanguages>;
  status?: string;
  tagline?: string;
  title: string;
  video?: false;
  vote_average?: number;
  vote_count?: number;
}
