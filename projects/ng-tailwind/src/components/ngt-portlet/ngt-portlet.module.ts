import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtHelperComponent } from '../ngt-helper/ngt-helper.component';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtPortletBodyComponent } from './ngt-portlet-body/ngt-portlet-body.component';
import { NgtPortletFooterComponent } from './ngt-portlet-footer/ngt-portlet-footer.component';
import { NgtPortletHeaderComponent } from './ngt-portlet-header/ngt-portlet-header.component';
import { NgtPortletComponent } from './ngt-portlet.component';

@NgModule({
    declarations: [
        NgtPortletComponent,
        NgtPortletHeaderComponent,
        NgtPortletBodyComponent,
        NgtPortletFooterComponent
    ],
    exports: [
        NgtPortletComponent,
        NgtPortletHeaderComponent,
        NgtPortletBodyComponent,
        NgtPortletFooterComponent
    ],
    imports: [
        CommonModule,
        NgtSvgModule,
        NgtHelperComponent
    ]
})
export class NgtPortletModule { }
