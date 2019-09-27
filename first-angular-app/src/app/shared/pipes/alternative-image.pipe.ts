import { Pipe, PipeTransform } from "@angular/core";
import { constants } from "../../core/constants";

@Pipe({
    name: "alternativeImage"
})
export class AlternativeImagePipe implements PipeTransform {
    public transform(str: string): string {
        if (str) {
            return `${constants.IMAGE_PART_PATH}${str}`;
        }
        return constants.NO_IMAGE_FOUND;
    }
}
