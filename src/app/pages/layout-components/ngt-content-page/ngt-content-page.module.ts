import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
    NgtContentModule,
    NgtInputModule,
    NgtPortletModule,
    NgtStylizableModule,
} from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtContentPageComponent } from './ngt-content-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtContentPageComponent
    }
];

@NgModule({
    declarations: [NgtContentPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtContentModule,
        NgtStylizableTemplateModule,
        NgtStylizableModule,
        NgtInputModule
    ]
})
export class NgtContentPageModule { }
