import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtFormValidationMessageComponent } from './ngt-form-validation-message/ngt-form-validation-message.component';
import { NgtFormComponent } from './ngt-form.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgtFormComponent,
        NgtFormValidationMessageComponent
    ],
    exports: [
        NgtFormComponent,
        NgtFormValidationMessageComponent
    ]

})
export class NgtFormModule { }
