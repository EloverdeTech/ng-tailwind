import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtSectionComponent } from './ngt-section.component';

@NgModule({
  declarations: [NgtSectionComponent],
  exports: [NgtSectionComponent],
  imports: [
    CommonModule,
    NgtStylizableModule,
    NgtSvgModule
  ]
})
export class NgtSectionModule { }