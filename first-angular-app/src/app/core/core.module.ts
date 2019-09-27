import { NgModule } from "@angular/core";

import { ServicesModule } from "./services/services.module";

@NgModule({
    declarations: [],
    imports: [ServicesModule],
    exports: [ServicesModule]
})
export class CoreModule {}
