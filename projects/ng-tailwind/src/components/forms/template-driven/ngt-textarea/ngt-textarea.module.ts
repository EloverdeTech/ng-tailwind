import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtTextareaComponent } from './ngt-textarea.component';

@NgModule({
    declarations: [NgtTextareaComponent],
    exports: [NgtTextareaComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtHelperComponent,
    ]
})
export class NgtTextareaModule { }
