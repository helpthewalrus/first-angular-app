import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/shared.module";

import { FilmsToWatchPageComponent } from "./films-to-watch-page.component";

@NgModule({
    declarations: [FilmsToWatchPageComponent],
    imports: [SharedModule, CommonModule, FormsModule],
    providers: [],
    exports: [FilmsToWatchPageComponent]
})
export class FilmsToWatchPageModule {}
