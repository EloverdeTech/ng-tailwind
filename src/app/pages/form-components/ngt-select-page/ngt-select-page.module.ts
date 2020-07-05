import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtPortletModule, NgtSelectModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtSelectPageComponent } from './ngt-select-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtSelectPageComponent
    }
];

@NgModule({
    declarations: [NgtSelectPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtStylizableTemplateModule,
        NgtSelectModule
    ]
})
export class NgtSelectPageModule { }
