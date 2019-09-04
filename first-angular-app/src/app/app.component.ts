import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from "@angular/core";
import { SearchResultService } from "./services/search-result.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public loading = false;
  public inputValue = "";
  public resultMovies = [];

  constructor(private searchResultService: SearchResultService, private cdr: ChangeDetectorRef) {}

  public fetchMoviesTitles(movieName: string): any {
    this.loading = true;
    this.searchResultService.fetchMoviesTitles(movieName).subscribe((response: any): void => {
      this.resultMovies = response;
      this.loading = false;
      this.cdr.detectChanges(); // DETECT CHANGES IN COMPONENT AND ITS CHILDREN
    });
  }
}
