import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtHeaderNavComponent } from './ngt-header-nav.component';

@NgModule({
    declarations: [NgtHeaderNavComponent],
    exports: [NgtHeaderNavComponent],
    imports: [
        CommonModule
    ]
})
export class NgtHeaderNavModule { }
