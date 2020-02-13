import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtSidenavComponent } from './ngt-sidenav.component';

@NgModule({
  declarations: [NgtSidenavComponent],
  exports: [NgtSidenavComponent],
  imports: [
    CommonModule
  ]
})
export class NgtSidenavModule { }
