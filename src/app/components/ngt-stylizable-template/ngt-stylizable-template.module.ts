import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodePreviewModule } from '../code-preview/code-preview.module';
import { NgtStylizableTemplateComponent } from './ngt-stylizable-template.component';



@NgModule({
  declarations: [NgtStylizableTemplateComponent],
  exports: [NgtStylizableTemplateComponent],
  imports: [
    CommonModule,
    CodePreviewModule
  ]
})
export class NgtStylizableTemplateModule { }
