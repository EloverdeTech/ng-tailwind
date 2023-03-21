import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
    NgtCheckboxModule,
    NgtDropdownModule,
    NgtPortletModule,
    NgtStylizableModule,
} from 'projects/ng-tailwind/src/public-api';
import { CodePreviewModule } from 'src/app/components/code-preview/code-preview.module';
import { NgtStylizableTemplateModule } from 'src/app/components/ngt-stylizable-template/ngt-stylizable-template.module';

import { NgtDropdownPageComponent } from './ngt-dropdown-page.component';

const routes: Routes = [
    {
        "path": '',
        "component": NgtDropdownPageComponent
    }
];

@NgModule({
    declarations: [NgtDropdownPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        CodePreviewModule,
        NgtPortletModule,
        NgtCheckboxModule,
        NgtStylizableModule,
        NgtStylizableTemplateModule,
        NgtDropdownModule
    ]
})
export class NgtDropdownPageModule { }
