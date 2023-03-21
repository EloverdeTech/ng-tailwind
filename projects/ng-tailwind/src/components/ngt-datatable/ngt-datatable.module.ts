import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';
import { NgtActionModule } from '../ngt-action/ngt-action.module';
import { NgtCheckboxModule } from '../ngt-checkbox/ngt-checkbox.module';
import { NgtInputModule } from '../ngt-input/ngt-input.module';
import { NgtModalModule } from '../ngt-modal/ngt-modal.module';
import { NgtPaginationModule } from '../ngt-pagination/ngt-pagination.module';
import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtTagModule } from '../ngt-tag/ngt-tag.module';
import { NgtDatatableComponent } from './ngt-datatable.component';
import { NgtTbodyComponent } from './ngt-tbody/ngt-tbody.component';
import { NgtTdCheckComponent } from './ngt-td-check/ngt-td-check.component';
import { NgtTdComponent } from './ngt-td/ngt-td.component';
import { NgtThCheckComponent } from './ngt-th-check/ngt-th-check.component';
import { NgtThComponent } from './ngt-th/ngt-th.component';
import { NgtTheadComponent } from './ngt-thead/ngt-thead.component';
import { NgtTrComponent } from './ngt-tr/ngt-tr.component';

@NgModule({
    declarations: [
        NgtDatatableComponent,
        NgtTbodyComponent,
        NgtTdComponent,
        NgtTdCheckComponent,
        NgtThComponent,
        NgtThCheckComponent,
        NgtTheadComponent,
        NgtTrComponent
    ],
    exports: [
        NgtDatatableComponent,
        NgtTbodyComponent,
        NgtTdComponent,
        NgtTdCheckComponent,
        NgtThComponent,
        NgtThCheckComponent,
        NgtTheadComponent,
        NgtTrComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgtShiningModule,
        NgtPaginationModule,
        NgtCheckboxModule,
        NgtInputModule,
        NgtModalModule,
        NgtTagModule,
        NgtActionModule,
        NgtStylizableModule
    ]
})
export class NgtDatatableModule { }
