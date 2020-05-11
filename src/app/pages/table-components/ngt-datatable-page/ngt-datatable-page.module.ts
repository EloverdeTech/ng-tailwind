import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtButtonModule, NgtDatatableModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';

import { NgtDatatablePageComponent } from './ngt-datatable-page.component';

const routes: Routes = [
  {
    "path": '',
    "component": NgtDatatablePageComponent
  }
];

@NgModule({
  declarations: [NgtDatatablePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    CodePreviewModule,
    NgtPortletModule,
    NgtDatatableModule,
    NgtButtonModule
  ]
})
export class NgtDatatablePageModule { }
