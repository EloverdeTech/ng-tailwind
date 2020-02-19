import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtShiningComponent } from './ngt-shining.component';



@NgModule({
  declarations: [NgtShiningComponent],
  exports: [NgtShiningComponent],
  imports: [
    CommonModule
  ]
})
export class NgtShiningModule { }
