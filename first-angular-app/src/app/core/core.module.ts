import { NgModule } from "@angular/core";

import { MaterialModule } from "./material/material.module";
import { ServicesModule } from "./services/services.module";

@NgModule({
    declarations: [],
    imports: [ServicesModule, MaterialModule],
    exports: [ServicesModule, MaterialModule]
})
export class CoreModule {}
