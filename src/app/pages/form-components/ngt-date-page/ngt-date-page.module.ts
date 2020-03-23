import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtDateModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';

import { NgtDatePageComponent } from './ngt-date-page.component';

const routes: Routes = [
  {
    "path": '',
    "component": NgtDatePageComponent
  }
];

@NgModule({
  declarations: [NgtDatePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    CodePreviewModule,
    NgtPortletModule,
    NgtDateModule
  ]
})
export class NgtDatePageModule { }
