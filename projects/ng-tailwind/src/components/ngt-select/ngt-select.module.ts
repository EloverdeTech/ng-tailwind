import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgtFormModule } from '../ngt-form/ngt-form.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtSelectComponent } from './ngt-select.component';
import { NgtSelectOptionSelectedTmp, NgtSelectOptionTmp } from './ngt-select.directive';

@NgModule({
  declarations: [
    NgtSelectComponent,
    NgtSelectOptionTmp,
    NgtSelectOptionSelectedTmp
  ],
  exports: [
    NgtSelectComponent,
    NgtSelectOptionTmp,
    NgtSelectOptionSelectedTmp
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgtValidationModule,
    NgtFormModule
  ]
})
export class NgtSelectModule { }