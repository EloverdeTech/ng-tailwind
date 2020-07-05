import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtPortletModule, NgtTextareaModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtTextareaPageComponent } from './ngt-textarea-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtTextareaPageComponent
    }
];

@NgModule({
    declarations: [NgtTextareaPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtTextareaModule,
        NgtStylizableTemplateModule
    ]
})
export class NgtTextareaPageModule { }
