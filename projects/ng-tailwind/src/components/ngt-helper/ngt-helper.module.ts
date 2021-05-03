import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SatPopoverModule } from "@ncstate/sat-popover";
import { NgtSvgModule } from "../ngt-svg/ngt-svg.module";
import { NgtHelperComponent } from "./ngt-helper.component";

@NgModule({
    declarations: [NgtHelperComponent],
    exports: [NgtHelperComponent],
    imports: [
        CommonModule,
        NgtSvgModule,
        SatPopoverModule
    ]
})
export class NgtHelperModule { }
