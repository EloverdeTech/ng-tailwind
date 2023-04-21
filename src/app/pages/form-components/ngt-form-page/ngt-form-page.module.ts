import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgtButtonModule, NgtFormModule, NgtInputModule, NgtPortletModule } from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';

import { NgtFormPageComponent } from './ngt-form-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtFormPageComponent
    }
];

@NgModule({
    declarations: [NgtFormPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtFormModule,
        NgtInputModule,
        NgtButtonModule
    ]
})
export class NgtFormPageModule { }
