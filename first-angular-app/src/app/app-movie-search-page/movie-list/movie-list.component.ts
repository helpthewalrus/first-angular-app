import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

import { JoinedMovieData } from "src/app/core";

@Component({
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  styleUrls: ["./movie-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  /** import array of data about found movies */
  @Input() public moviesInfo: Array<JoinedMovieData>;
}