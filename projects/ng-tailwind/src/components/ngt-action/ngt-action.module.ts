import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtActionComponent } from './ngt-action.component';

@NgModule({
    declarations: [NgtActionComponent],
    exports: [NgtActionComponent],
    imports: [
        CommonModule,
        RouterModule,
        NgtSvgModule
    ]
})
export class NgtActionModule { }
