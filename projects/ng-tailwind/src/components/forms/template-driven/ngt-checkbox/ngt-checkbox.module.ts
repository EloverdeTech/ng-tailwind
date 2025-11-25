import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtCheckboxComponent } from './ngt-checkbox.component';

@NgModule({
    declarations: [NgtCheckboxComponent],
    exports: [NgtCheckboxComponent],
    imports: [
        CommonModule,
        NgtShiningModule,
        NgtHelperComponent,
    ]
})
export class NgtCheckboxModule { }
