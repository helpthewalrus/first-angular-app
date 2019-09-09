import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";

import { AppMovieSearchPageComponent } from "./app-movie-search-page.component";
import { SearchInputComponent } from "./search-input/search-input.component";

@NgModule({
  declarations: [AppMovieSearchPageComponent, SearchInputComponent],
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatListModule],
  providers: [],
  exports: [AppMovieSearchPageComponent]
})
export class AppMovieSearchPageModule {}
