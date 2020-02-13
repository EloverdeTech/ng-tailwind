import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgtSectionModule, NgtHeaderNavModule, NgtSidenavModule } from 'ng-tailwind';
import { NgtInputModule } from 'ng-tailwind';
import { FormsModule } from '@angular/forms';
import { NgtContentModule } from 'ng-tailwind';

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
    NgtContentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
