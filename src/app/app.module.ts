import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgtButtonModule,
  NgtContentModule,
  NgtDateModule,
  NgtHeaderNavModule,
  NgtInputModule,
  NgtPortletModule,
  NgtSectionModule,
  NgtSidenavModule,
  NgtStylizableModule,
} from 'ng-tailwind';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgtModalModule } from 'projects/ng-tailwind/src/public-api';

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
    NgtModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
