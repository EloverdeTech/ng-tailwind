import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtContextMenuComponent } from './ngt-context-menu.component';
import { NgtContextMenuDirective } from './ngt-context-menu.directive';

@NgModule({
    declarations: [
        NgtContextMenuDirective,
        NgtContextMenuComponent,
    ],
    exports: [
        NgtContextMenuDirective,
        NgtContextMenuComponent,
    ],
    imports: [
        CommonModule,
        NgtSvgModule
    ],
})
export class NgtContextMenuModule { }
