import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtDropdownModule } from '../ngt-dropdown/ngt-dropdown.module';
import { NgtPopoverComponent } from './ngt-popover.component';

@NgModule({
    declarations: [ NgtPopoverComponent ],
    exports: [ NgtPopoverComponent ],
    imports: [
        CommonModule,
        NgtDropdownModule
    ]
})
export class NgtPopoverModule { }
