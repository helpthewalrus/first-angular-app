import { NgModule } from "@angular/core";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
    imports: [MatInputModule, MatButtonModule, MatListModule, MatCardModule, MatGridListModule, MatProgressBarModule],
    exports: [MatInputModule, MatButtonModule, MatListModule, MatCardModule, MatGridListModule, MatProgressBarModule]
})
export class MaterialModule {}
