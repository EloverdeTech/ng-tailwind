import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtPopoverTooltipComponent } from './ngt-popover-tooltip/ngt-popover-tooltip.component';
import { NgtPopoverComponent } from './ngt-popover.component';
import { NgtPopoverDirective } from './ngt-popover.directive';
import { NgtDropdownComponent } from '../ngt-dropdown/ngt-dropdown.component';

@NgModule({
    exports: [
        NgtPopoverComponent,
        NgtPopoverDirective
    ],
    declarations: [
        NgtPopoverComponent,
        NgtPopoverTooltipComponent,
        NgtPopoverDirective
    ],
    imports: [
        CommonModule,
        NgtDropdownComponent
    ]
})
export class NgtPopoverModule { }
