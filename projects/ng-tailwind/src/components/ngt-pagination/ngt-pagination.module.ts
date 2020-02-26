import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtPaginationComponent } from './ngt-pagination.component';
import { NgtActionModule } from '../ngt-action/ngt-action.module';
import { NgtStylizableModule } from '../../directives/ngt-stylizable/ngt-stylizable.module';


@NgModule({
  declarations: [NgtPaginationComponent],
  exports: [NgtPaginationComponent],
  imports: [
    CommonModule,
    NgtStylizableModule,
    NgtActionModule
  ]
})
export class NgtPaginationModule { }
