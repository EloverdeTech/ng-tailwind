import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';
import { NgtActionModule } from '../ngt-action/ngt-action.module';
import { NgtSelectModule } from '../ngt-select/ngt-select.module';
import { NgtPaginationComponent } from './ngt-pagination.component';


@NgModule({
  declarations: [NgtPaginationComponent],
  exports: [NgtPaginationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgtStylizableModule,
    NgtActionModule,
    NgtSelectModule,
  ]
})
export class NgtPaginationModule { }
