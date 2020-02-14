import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';
import { NgtSectionComponent } from './ngt-section.component';

@NgModule({
  declarations: [NgtSectionComponent],
  exports: [NgtSectionComponent],
  imports: [
    CommonModule,
    NgtStylizableModule
  ]
})
export class NgtSectionModule { }