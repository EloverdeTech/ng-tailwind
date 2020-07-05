import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgtFloatingButtonModule, NgtPortletModule, NgtStylizableModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtFloatingButtonPageComponent } from './ngt-floating-button-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtFloatingButtonPageComponent
    }
];

@NgModule({
    declarations: [NgtFloatingButtonPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CodePreviewModule,
        NgtPortletModule,
        NgtFloatingButtonModule,
        NgtStylizableModule,
        NgtStylizableTemplateModule
    ]
})
export class NgtFloatingButtonPageModule { }
