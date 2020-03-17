import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgtButtonModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';

import { NgtButtonPageComponent } from './ngt-button-page.component';

const routes: Routes = [
  {
    "path": '',
    "component": NgtButtonPageComponent
  }
];

@NgModule({
  declarations: [NgtButtonPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CodePreviewModule,
    NgtPortletModule,
    NgtButtonModule
  ]
})
export class NgtButtonPageModule { }
