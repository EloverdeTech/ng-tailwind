import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtValidationComponent } from './ngt-validation.component';

@NgModule({
    declarations: [NgtValidationComponent],
    exports: [NgtValidationComponent],
    imports: [
        CommonModule
    ]
})
export class NgtValidationModule { }
