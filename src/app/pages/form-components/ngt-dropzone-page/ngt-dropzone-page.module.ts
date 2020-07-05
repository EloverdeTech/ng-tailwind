import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtDropzoneModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';

import { NgtDropzonePageComponent } from './ngt-dropzone-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtDropzonePageComponent
    }
];

@NgModule({
    declarations: [NgtDropzonePageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtDropzoneModule,
    ]
})
export class NgtDropzonePageModule { }
