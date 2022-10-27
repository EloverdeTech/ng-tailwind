import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgtFormModule } from '../ngt-form/ngt-form.module';
import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtTextareaComponent } from './ngt-textarea.component';

@NgModule({
    declarations: [NgtTextareaComponent],
    exports: [NgtTextareaComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtHelperModule,
        NgtFormModule
    ]
})
export class NgtTextareaModule { }
