import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { JoinedMovieData } from "src/app/core";

@Component({
    selector: "app-movie-list-item",
    templateUrl: "./movie-list-item.component.html",
    styleUrls: ["./movie-list-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListItemComponent {
    /**
     * import data for rendering about one of the found movies
     */
    @Input() public movie: JoinedMovieData;

    /**
     * emitted data with checkbox "add this film to my watchlist" value
     */
    @Output() public isAddedToWatchList: EventEmitter<boolean> = new EventEmitter();

    /** variable used to keep search input value */
    public checked: boolean = false;

    /**
     * when checkbox value changes than emit checkbox value
     */
    public onChangeCheckbox(): void {
        this.checked = !this.checked;
        const checked: boolean = !this.checked;
        this.isAddedToWatchList.emit(checked);
    }
}
