import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";

import { JoinedMovieDataCheckbox } from "../../core/index";

@Component({
    selector: "app-movie-list-item",
    templateUrl: "./movie-list-item.component.html",
    styleUrls: ["./movie-list-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListItemComponent {
    /**
     * Import data for rendering about one of the found movies
     */
    @Input() public movie: JoinedMovieDataCheckbox;

    /**
     * Emitted data with checkbox "add this film to my watchlist" value
     */
    @Output() public movieAddedToWatchList: EventEmitter<JoinedMovieDataCheckbox> = new EventEmitter();

    /**
     * When checkbox value changes than emit checkbox value
     */
    public onChangeCheckbox(): void {
        this.movieAddedToWatchList.emit(this.movie);
    }
}
