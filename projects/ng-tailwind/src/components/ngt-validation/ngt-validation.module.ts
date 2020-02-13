import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtValidationComponent } from './ngt-validation.component';



@NgModule({
  declarations: [NgtValidationComponent],
  exports: [NgtValidationComponent],
  imports: [
    CommonModule
  ]
})
export class NgtValidationModule { }
