import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtCheckboxComponent } from './ngt-checkbox.component';

@NgModule({
    declarations: [NgtCheckboxComponent],
    exports: [NgtCheckboxComponent],
    imports: [
        CommonModule,
        NgtShiningModule,
        NgtHelperModule,
    ]
})
export class NgtCheckboxModule { }
