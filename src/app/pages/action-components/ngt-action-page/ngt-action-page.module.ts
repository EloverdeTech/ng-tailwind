import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgtActionModule, NgtPortletModule, NgtStylizableModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtActionPageComponent } from './ngt-action-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtActionPageComponent
    }
];

@NgModule({
    declarations: [NgtActionPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CodePreviewModule,
        NgtPortletModule,
        NgtActionModule,
        NgtStylizableModule,
        NgtStylizableTemplateModule
    ]
})
export class NgtActionPageModule { }
