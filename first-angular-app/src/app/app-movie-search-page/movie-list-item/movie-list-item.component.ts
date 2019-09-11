import { Component, Input } from "@angular/core";

import { JoinedMovieData } from "src/app/core";

@Component({
  selector: "app-movie-list-item",
  templateUrl: "./movie-list-item.component.html",
  styleUrls: ["./movie-list-item.component.scss"]
})
export class MovieListItemComponent {
  /** import data for rendering about one of the found movies */
  @Input() public movie: JoinedMovieData;
}
