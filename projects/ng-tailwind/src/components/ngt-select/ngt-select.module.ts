import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtSelectComponent } from './ngt-select.component';
import { FormsModule } from '@angular/forms';
import { NgtSelectOptionTmp, NgtSelectOptionSelectedTmp } from './ngt-select.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';

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
    NgtValidationModule
  ]
})
export class NgtSelectModule { }