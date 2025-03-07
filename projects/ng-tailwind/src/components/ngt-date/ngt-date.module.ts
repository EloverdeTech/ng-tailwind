import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtDateComponent } from './ngt-date.component';
import { EvDatePickerModule } from 'ev-date-picker';

@NgModule({
    declarations: [NgtDateComponent],
    exports: [NgtDateComponent],
    imports: [
        CommonModule,
        FormsModule,
        EvDatePickerModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtHelperModule,
    ]
})
export class NgtDateModule { }
