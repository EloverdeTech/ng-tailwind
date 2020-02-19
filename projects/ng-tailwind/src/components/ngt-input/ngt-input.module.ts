import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtInputComponent } from './ngt-input.component';

@NgModule({
  declarations: [NgtInputComponent],
  exports: [NgtInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgtValidationModule,
    NgtShiningModule
  ]
})
export class NgtInputModule { }
