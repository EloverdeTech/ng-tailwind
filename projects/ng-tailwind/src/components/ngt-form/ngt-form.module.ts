import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtFormValidationMessageModule } from './ngt-form-validation-message/ngt-form-validation-message.module';
import { NgtFormComponent } from './ngt-form.component';



@NgModule({
  declarations: [NgtFormComponent],
  exports: [NgtFormComponent],
  imports: [
    CommonModule,
    NgtFormValidationMessageModule
  ]
})
export class NgtFormModule { }
