import { NgModule } from '@angular/core';

import { NgtReactiveSelectComponent } from './ngt-reactive-select.component';
import {
    NgtReactiveSelectHeaderTemplate,
    NgtReactiveSelectOptionSelectedTemplate,
    NgtReactiveSelectOptionTemplate,
} from './ngt-reactive-select.directive';

@NgModule({
    imports: [
        NgtReactiveSelectComponent,
        NgtReactiveSelectOptionTemplate,
        NgtReactiveSelectOptionSelectedTemplate,
        NgtReactiveSelectHeaderTemplate,
    ],
    exports: [
        NgtReactiveSelectComponent,
        NgtReactiveSelectOptionTemplate,
        NgtReactiveSelectOptionSelectedTemplate,
        NgtReactiveSelectHeaderTemplate,
    ],
})
export class NgtReactiveSelectModule { }
