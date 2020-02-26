import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtDropdownComponent } from './ngt-dropdown.component';
import { NgtDropdownContainerComponent } from './ngt-dropdown-container/ngt-dropdown-container.component';

@NgModule({
  declarations: [NgtDropdownComponent, NgtDropdownContainerComponent],
  exports: [NgtDropdownComponent, NgtDropdownContainerComponent],
  imports: [
    CommonModule
  ]
})
export class NgtDropdownModule { }
