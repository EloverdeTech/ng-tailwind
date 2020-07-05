import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgtPortletModule } from 'projects/ng-tailwind/src/public-api';

import { InstallationComponent } from './installation.component';

const routes: Routes = [
    {
        "path": '',
        "component": InstallationComponent
    }
];

@NgModule({
    declarations: [InstallationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgtPortletModule
    ]
})
export class InstallationModule { }
