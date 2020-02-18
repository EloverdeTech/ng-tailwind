import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgtActionComponent } from './ngt-action.component';



@NgModule({
  declarations: [NgtActionComponent],
  exports: [NgtActionComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class NgtActionModule { }
