import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtRadioButtonContainerComponent } from './ngt-radio-button-container/ngt-radio-button-container.component';
import { NgtRadioButtonComponent } from './ngt-radio-button.component';

@NgModule({
    declarations: [NgtRadioButtonComponent, NgtRadioButtonContainerComponent],
    exports: [NgtRadioButtonComponent, NgtRadioButtonContainerComponent],
    imports: [
        CommonModule,
        NgtShiningModule,
        NgtHelperModule
    ]
})
export class NgtRadioButtonModule { }
