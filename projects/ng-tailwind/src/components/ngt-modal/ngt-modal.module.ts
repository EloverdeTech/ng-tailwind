import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgtModalBodyComponent } from './ngt-modal-body/ngt-modal-body.component';
import { NgtModalFooterComponent } from './ngt-modal-footer/ngt-modal-footer.component';
import { NgtModalHeaderComponent } from './ngt-modal-header/ngt-modal-header.component';
import { NgtModalComponent } from './ngt-modal.component';



@NgModule({
  declarations: [
    NgtModalComponent,
    NgtModalHeaderComponent,
    NgtModalBodyComponent,
    NgtModalFooterComponent
  ],
  exports: [
    NgtModalComponent,
    NgtModalHeaderComponent,
    NgtModalBodyComponent,
    NgtModalFooterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NgtModalModule { }
