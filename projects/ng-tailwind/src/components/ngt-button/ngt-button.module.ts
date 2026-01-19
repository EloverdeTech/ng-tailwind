import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgtButtonComponent } from './ngt-button.component';

@NgModule({
    declarations: [NgtButtonComponent],
    exports: [NgtButtonComponent],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class NgtButtonModule { }
