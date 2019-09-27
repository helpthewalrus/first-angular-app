import { NgModule } from "@angular/core";

import { PipesModule } from "./pipes/pipes.module";
import { MaterialModule } from "./material/material.module";

@NgModule({
    imports: [PipesModule, MaterialModule],
    exports: [PipesModule, MaterialModule]
})
export class SharedModule {}
