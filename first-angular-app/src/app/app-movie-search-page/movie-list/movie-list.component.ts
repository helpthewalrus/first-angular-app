import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { JoinedMovieData, JoinedMovieDataCheckbox } from "../../core";

@Component({
    selector: "app-movie-list",
    templateUrl: "./movie-list.component.html",
    styleUrls: ["./movie-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
    /**
     * import array of data about found movies
     */
    @Input() public moviesInfo: Array<JoinedMovieData>;

    /**
     * emitted data with checkbox "add this film to my watchlist" state and info about movie
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
     * when checkbox value changes than emit data with checkbox state and info about movie
     */
    public onAddToWatchList($event: boolean, movie: JoinedMovieData): void {
        const result: JoinedMovieDataCheckbox = { joinedMovieData: movie, isAddedToWatchList: $event };
        this.movieInfoWithCheckboxState.emit(result);
    }
}
