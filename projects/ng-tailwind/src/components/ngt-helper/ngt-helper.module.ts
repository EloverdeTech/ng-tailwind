import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgtSvgModule } from "../ngt-svg/ngt-svg.module";
import { NgtHelperComponent } from "./ngt-helper.component";
import { NgtDropdownModule } from '../ngt-dropdown/ngt-dropdown.module';

@NgModule({
    declarations: [NgtHelperComponent],
    exports: [NgtHelperComponent],
    imports: [
        CommonModule,
        NgtSvgModule,
        NgtDropdownModule
    ]
})
export class NgtHelperModule { }
