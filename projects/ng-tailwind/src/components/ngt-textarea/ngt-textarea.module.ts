import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtTextareaComponent } from './ngt-textarea.component';



@NgModule({
  declarations: [NgtTextareaComponent],
  exports: [NgtTextareaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgtValidationModule,
    NgtShiningModule
  ]
})
export class NgtTextareaModule { }
