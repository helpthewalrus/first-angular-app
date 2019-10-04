import { NgModule } from "@angular/core";

import {
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatExpansionModule
} from "@angular/material";

const material: Array<MaterialModule> = [
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatExpansionModule
];
@NgModule({
    imports: [material],
    exports: [material]
})
export class MaterialModule {}
