import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgtSvgModule } from "../ngt-svg/ngt-svg.module";
import { NgtHelperComponent } from "./ngt-helper.component";
import { NgtDropdownComponent } from "../ngt-dropdown/ngt-dropdown.component";

@NgModule({
    declarations: [NgtHelperComponent],
    exports: [NgtHelperComponent],
    imports: [
        CommonModule,
        NgtSvgModule,
        NgtDropdownComponent
    ]
})
export class NgtHelperModule { }
