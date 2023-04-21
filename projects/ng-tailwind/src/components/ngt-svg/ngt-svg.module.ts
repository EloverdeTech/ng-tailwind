import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { NgtSvgComponent } from './ngt-svg.component';

@NgModule({
    declarations: [NgtSvgComponent],
    exports: [NgtSvgComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        AngularSvgIconModule.forRoot()
    ]
})
export class NgtSvgModule { }
