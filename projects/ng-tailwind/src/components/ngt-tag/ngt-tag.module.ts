import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtTagComponent } from './ngt-tag.component';



@NgModule({
  declarations: [NgtTagComponent],
  exports: [NgtTagComponent],
  imports: [
    CommonModule,
    NgtSvgModule
  ]
})
export class NgtTagModule { }
