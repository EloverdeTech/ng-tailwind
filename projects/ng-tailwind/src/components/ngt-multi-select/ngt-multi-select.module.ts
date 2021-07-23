import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';
import { NgtCheckboxModule } from '../ngt-checkbox/ngt-checkbox.module';
import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtInputModule } from '../ngt-input/ngt-input.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtMultiSelectComponent } from './ngt-multi-select.component';

@NgModule({
    declarations: [
        NgtMultiSelectComponent
    ],
    exports: [
        NgtMultiSelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtHelperModule,
        NgtInputModule,
        NgtCheckboxModule,
        NgtStylizableModule
    ]
})
export class NgtMultiSelectModule { }
