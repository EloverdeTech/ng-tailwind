import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtButtonComponent } from './ngt-button.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NgtButtonComponent],
  exports: [NgtButtonComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class NgtButtonModule { }
