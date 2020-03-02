import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgtFormModule } from '../ngt-form/ngt-form.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
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
    NgtShiningModule,
    NgtSvgModule,
    NgtFormModule
  ]
})
export class NgtInputModule { }
