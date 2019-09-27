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

    /**
     * Function that keeps track and improves *ngFor performance directive
     *
     * @param index - index of the provided element
     * @param item - element itself
     */
    public trackByFunction(id: number, item: JoinedMovieData): number {
        return item ? item.id : null;
    }
}
