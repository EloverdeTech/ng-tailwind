import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtStylizableDirective } from './ngt-stylizable.directive';

@NgModule({
  declarations: [NgtStylizableDirective],
  exports: [NgtStylizableDirective],
  imports: [
    CommonModule
  ]
})
export class NgtStylizableModule { }
