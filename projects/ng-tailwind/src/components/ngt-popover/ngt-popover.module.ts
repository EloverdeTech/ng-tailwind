import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtDropdownModule } from '../ngt-dropdown/ngt-dropdown.module';
import { NgtPopoverTooltipComponent } from './ngt-popover-tooltip/ngt-popover-tooltip.component';
import { NgtPopoverComponent } from './ngt-popover.component';
import { NgtPopoverDirective } from './ngt-popover.directive';

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
        NgtDropdownModule
    ]
})
export class NgtPopoverModule { }
