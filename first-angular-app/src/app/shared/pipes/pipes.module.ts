import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlternativeImagePipe } from "./alternative-image.pipe";

@NgModule({
  declarations: [AlternativeImagePipe],
  imports: [CommonModule],
  exports: [AlternativeImagePipe]
})
export class PipesModule {}
