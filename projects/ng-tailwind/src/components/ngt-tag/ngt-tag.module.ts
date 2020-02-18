import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtTagComponent } from './ngt-tag.component';



@NgModule({
  declarations: [NgtTagComponent],
  exports: [NgtTagComponent],
  imports: [
    CommonModule
  ]
})
export class NgtTagModule { }
