import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgtActionModule,
  NgtButtonModule,
  NgtCheckboxModule,
  NgtContentModule,
  NgtDateModule,
  NgtFloatingButtonModule,
  NgtHeaderNavModule,
  NgtInputModule,
  NgtModalModule,
  NgtPortletModule,
  NgtSectionModule,
  NgtSidenavModule,
  NgtStylizableModule,
  NgtTagModule,
  NgtTextareaModule,
  NgtDropdownModule,
} from 'ng-tailwind';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgtSectionModule,
    NgtInputModule,
    NgtHeaderNavModule,
    NgtSidenavModule,
    NgtContentModule,
    NgtStylizableModule,
    NgtPortletModule,
    NgtButtonModule,
    NgtDateModule,
    NgtModalModule,
    NgtTextareaModule,
    NgtCheckboxModule,
    NgtActionModule,
    NgtTagModule,
    NgtFloatingButtonModule,
    NgtDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
