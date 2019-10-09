import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { JoinedMovieData, JoinedMovieDataCheckbox } from "../../core/index";

@Component({
    selector: "app-movie-list",
    templateUrl: "./movie-list.component.html",
    styleUrls: ["./movie-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
    /**
     * Import array of data about found movies
     */
    @Input() public moviesInfo: Array<JoinedMovieData>;

    /**
     * Emitted data with checkbox "add this film to my watchlist" state and info about movie
     */
    @Output() public movieInfoWithCheckboxState: EventEmitter<JoinedMovieDataCheckbox> = new EventEmitter();

    /**
     * Function that keeps track and improves *ngFor performance directive
     *
     * @param index - index of the provided element
     * @param item - element itself
     */
    public trackByFunction(id: number, item: JoinedMovieData): number {
        return item ? item.id : null;
    }

    /**
     * When checkbox value changes than emit data with checkbox state and info about movie
     */
    public onAddToWatchList($event: boolean, movie: JoinedMovieData): void {
        const result: JoinedMovieDataCheckbox = { ...movie, isAddedToWatchList: $event };
        this.movieInfoWithCheckboxState.emit(result);
    }
}
