import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    NgtContentModule,
    NgtHeaderNavModule,
    NgtInputModule,
    NgtSidenavModule,
    NgtStylizableModule,
    NgtSvgModule,
} from 'projects/ng-tailwind/src/public-api';

import { HomeComponent } from './home.component';

@NgModule({
    declarations: [HomeComponent],
    exports: [HomeComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgtHeaderNavModule,
        NgtSvgModule,
        NgtStylizableModule,
        NgtSidenavModule,
        NgtContentModule,
        NgtInputModule
    ]
})
export class HomeModule { }
