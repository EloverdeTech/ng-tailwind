import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtCheckboxComponent } from './ngt-checkbox.component';



@NgModule({
  declarations: [NgtCheckboxComponent],
  exports: [NgtCheckboxComponent],
  imports: [
    CommonModule
  ]
})
export class NgtCheckboxModule { }
