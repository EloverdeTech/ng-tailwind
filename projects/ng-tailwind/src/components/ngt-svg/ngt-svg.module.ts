import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtSvgComponent } from './ngt-svg.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [NgtSvgComponent],
  exports: [NgtSvgComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularSvgIconModule
  ]
})
export class NgtSvgModule { }
