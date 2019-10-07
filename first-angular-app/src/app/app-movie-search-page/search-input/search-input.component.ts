import { Component, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-search-input",
    templateUrl: "./search-input.component.html",
    styleUrls: ["./search-input.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
    /**
     * Create EventEmitter object to emit value provided in search input
     */
    @Output() public add: EventEmitter<string> = new EventEmitter();

    /**
     * Variable used to keep search input value
     */
    public searchInput: string = "";

    /**
     * When form submitted emit input value and clears input field
     */
    public addSearchInput(): void {
        const searchInput: string = this.searchInput;
        this.add.emit(searchInput);
        this.searchInput = "";
    }
}
