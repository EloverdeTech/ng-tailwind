import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { NgtSvgComponent } from './ngt-svg.component';

@NgModule({
    imports: [
        CommonModule,
        AngularSvgIconModule.forRoot()
    ],
    declarations: [NgtSvgComponent],
    exports: [NgtSvgComponent]
})
export class NgtSvgModule { }
