import { Component, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-search-input",
    templateUrl: "./search-input.component.html",
    styleUrls: ["./search-input.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
    /** create EventEmitter object to emit value provided in search input */
    @Output() public add: EventEmitter<string> = new EventEmitter();

    /** variable used to keep search input value */
    public searchInput: string = "";

    /**
     * when form submitted emit input value and clears input field
     */
    public addSearchInput(): void {
        const searchInput: string = this.searchInput;
        this.add.emit(searchInput);
        this.searchInput = "";
    }
}
