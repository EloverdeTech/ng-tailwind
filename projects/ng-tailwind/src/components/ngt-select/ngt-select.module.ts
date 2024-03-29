import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgtFormModule } from '../ngt-form/ngt-form.module';
import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtSelectComponent } from './ngt-select.component';
import { NgtSelectHeaderTmp, NgtSelectOptionSelectedTmp, NgtSelectOptionTmp } from './ngt-select.directive';

@NgModule({
    declarations: [
        NgtSelectComponent,
        NgtSelectOptionTmp,
        NgtSelectOptionSelectedTmp,
        NgtSelectHeaderTmp
    ],
    exports: [
        NgtSelectComponent,
        NgtSelectOptionTmp,
        NgtSelectOptionSelectedTmp,
        NgtSelectHeaderTmp
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        NgtValidationModule,
        NgtFormModule,
        NgtShiningModule,
        NgtHelperModule,
        NgtSvgModule
    ]
})
export class NgtSelectModule { }
