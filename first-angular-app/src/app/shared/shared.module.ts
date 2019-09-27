import { NgModule } from "@angular/core";

import { PipesModule } from "./pipes/pipes.module";

@NgModule({
    imports: [PipesModule],
    exports: [PipesModule]
})
export class SharedModule {}
