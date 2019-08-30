import { Component, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrls: ["./search-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
  @Output() public add: EventEmitter<string> = new EventEmitter();
  public searchInput = "";

  public addSearchInput(): void {
    console.log("haha");
    if (this.searchInput.trim()) {
      const searchInput: string = this.searchInput;
      this.add.emit(searchInput);
      this.searchInput = "";
    }
  }
}
