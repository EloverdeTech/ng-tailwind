import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtInputComponent } from './ngt-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NgtInputComponent],
  exports: [NgtInputComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NgtInputModule { }
