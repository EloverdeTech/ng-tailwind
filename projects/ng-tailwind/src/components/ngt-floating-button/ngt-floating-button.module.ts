import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtFloatingButtonComponent } from './ngt-floating-button.component';



@NgModule({
  declarations: [NgtFloatingButtonComponent],
  exports: [NgtFloatingButtonComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    NgtSvgModule
  ]
})
export class NgtFloatingButtonModule { }
