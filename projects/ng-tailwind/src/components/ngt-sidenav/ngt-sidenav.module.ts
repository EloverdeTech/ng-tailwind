import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtSidenavComponent } from './ngt-sidenav.component';

@NgModule({
    declarations: [NgtSidenavComponent],
    exports: [NgtSidenavComponent],
    imports: [
        CommonModule
    ]
})
export class NgtSidenavModule { }
