import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtContentComponent } from './ngt-content.component';

@NgModule({
    declarations: [NgtContentComponent],
    exports: [NgtContentComponent],
    imports: [
        CommonModule
    ]
})
export class NgtContentModule { }
