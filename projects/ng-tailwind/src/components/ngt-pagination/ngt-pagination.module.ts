import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgtPaginationComponent } from './ngt-pagination.component';



@NgModule({
  declarations: [NgtPaginationComponent],
  exports: [NgtPaginationComponent],
  imports: [
    CommonModule
  ]
})
export class NgtPaginationModule { }
