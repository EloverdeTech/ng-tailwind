import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtFormValidationMessageComponent } from './ngt-form-validation-message.component';



@NgModule({
  declarations: [NgtFormValidationMessageComponent],
  exports: [NgtFormValidationMessageComponent],
  imports: [
    CommonModule
  ]
})
export class NgtFormValidationMessageModule { }
