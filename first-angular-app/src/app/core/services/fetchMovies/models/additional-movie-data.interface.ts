import { MovieCastData } from "./movie-cast-data";

export interface AdditionalMovieData {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: null;
  budget?: number;
  credits: { cast: Array<MovieCastData>; crew?: Array<any> };
  genres?: Array<object>;
  homepage?: null;
  id: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity?: number;
  poster_path: string;
  production_companies?: Array<object>;
  release_date: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: Array<object>;
  status?: string;
  tagline?: string;
  title: string;
  video?: false;
  vote_average?: number;
  vote_count?: number;
}
