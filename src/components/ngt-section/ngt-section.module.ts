import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtSectionComponent } from './ngt-section.component';
import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';

@NgModule({
  declarations: [NgtSectionComponent],
  exports: [NgtSectionComponent],
  imports: [
    CommonModule,
    NgtStylizableModule
  ]
})
export class NgtSectionModule { }