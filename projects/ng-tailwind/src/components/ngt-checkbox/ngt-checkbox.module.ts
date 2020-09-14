import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtCheckboxComponent } from './ngt-checkbox.component';

@NgModule({
    declarations: [NgtCheckboxComponent],
    exports: [NgtCheckboxComponent],
    imports: [
        CommonModule,
        NgtShiningModule,
    ]
})
export class NgtCheckboxModule { }
