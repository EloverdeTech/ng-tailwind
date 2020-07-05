import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgtPortletModule, NgtSvgModule } from 'projects/ng-tailwind/src/public-api';

import { ReleaseNotesComponent } from './release-notes.component';

const routes: Routes = [
    {
        "path": '',
        "component": ReleaseNotesComponent
    }
];

@NgModule({
    declarations: [ReleaseNotesComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgtPortletModule,
        NgtSvgModule
    ]
})
export class ReleaseNotesModule { }
