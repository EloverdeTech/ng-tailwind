import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { NgtPortletBodyComponent } from './ngt-portlet-body/ngt-portlet-body.component';
import { NgtPortletFooterComponent } from './ngt-portlet-footer/ngt-portlet-footer.component';
import { NgtPortletHeaderComponent } from './ngt-portlet-header/ngt-portlet-header.component';
import { NgtPortletComponent } from './ngt-portlet.component';
import { HttpClientModule } from '@angular/common/http';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';



@NgModule({
  declarations: [
    NgtPortletComponent,
    NgtPortletHeaderComponent,
    NgtPortletBodyComponent,
    NgtPortletFooterComponent
  ],
  exports: [
    NgtPortletComponent,
    NgtPortletHeaderComponent,
    NgtPortletBodyComponent,
    NgtPortletFooterComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NgtSvgModule
  ]
})
export class NgtPortletModule { }
