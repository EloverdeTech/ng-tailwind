import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../../../ngt-svg/ngt-svg.module';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtInputComponent } from './ngt-input.component';

@NgModule({
    declarations: [NgtInputComponent],
    exports: [NgtInputComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtSvgModule,
        NgtHelperComponent
    ]
})
export class NgtInputModule { }
