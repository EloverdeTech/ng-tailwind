import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtDropdownContainerComponent } from './ngt-dropdown-container/ngt-dropdown-container.component';
import { NgtDropdownComponent } from './ngt-dropdown.component';

@NgModule({
    declarations: [NgtDropdownComponent, NgtDropdownContainerComponent],
    exports: [NgtDropdownComponent, NgtDropdownContainerComponent],
    imports: [
        CommonModule
    ]
})
export class NgtDropdownModule { }
