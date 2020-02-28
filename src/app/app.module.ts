import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgtActionModule,
  NgtButtonModule,
  NgtCheckboxModule,
  NgtContentModule,
  NgtDatatableModule,
  NgtDateModule,
  NgtDropdownModule,
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
  NgtHttpService,
  NgtSelectModule
} from 'ng-tailwind';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgtHttpTest } from './services/ngt-http-test.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    NgtDropdownModule,
    NgtDatatableModule,
    NgtSelectModule
  ],
  providers: [
    {
      provide: NgtHttpService,
      useClass: NgtHttpTest
    },
    {
      provide: 'NgtStyleSuccessButton',
      useValue: {
        color: {
          bg: 'teal-500'
        }
      }
    },
    {
      provide: 'NgtInputStyle',
      useValue: {
        h: '12',
        color: {
          border: 'border-gray-400 focus:border-blue-500',
          text: 'gray-700'
        }
      }
    },
    {
      provide: 'NgtPortletStyle',
      useValue: {
        mx: '12',
        my: '12',
        h: 'auto',
        color: {
          bg: 'white',
          text: 'text-blue-500'
        }
      },      
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
