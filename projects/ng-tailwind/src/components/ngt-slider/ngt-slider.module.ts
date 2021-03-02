import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtSliderComponent } from './ngt-slider.component';

@NgModule({
    declarations: [NgtSliderComponent],
    exports: [NgtSliderComponent],
    imports: [
        CommonModule,
        NgtShiningModule,
    ]
})
export class NgtSliderModule { }
