import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtInputModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtInputPageComponent } from './ngt-input-page.component';

const routes: Routes = [
  {
    "path": '',
    "component": NgtInputPageComponent
  }
];

@NgModule({
  declarations: [NgtInputPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    CodePreviewModule,
    NgtPortletModule,
    NgtStylizableTemplateModule,
    NgtInputModule
  ]
})
export class NgtInputPageModule { }
