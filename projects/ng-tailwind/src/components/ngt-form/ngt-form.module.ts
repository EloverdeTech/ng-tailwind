import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtFormComponent } from './ngt-form.component';
import { NgtFormValidationMessageComponent } from './ngt-form-validation-message/ngt-form-validation-message.component';

@NgModule({
    imports: [
        CommonModule,
        NgtFormValidationMessageComponent,
    ],
    declarations: [
        NgtFormComponent,
    ],
    exports: [
        NgtFormComponent,
        NgtFormValidationMessageComponent
    ]

})
export class NgtFormModule { }
