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
      provide: 'NgtPaginationNextPreviousButtonStyle',
      useValue: {
        h: '8',
        w: '8',
        color: {
          text: 'white',
          bg: 'blue-700'
        }
      }
    },
    {
      provide: 'NgtPaginationFirstLastButtonStyle',
      useValue: {
        h: '8',
        w: '8',
        color: {
          text: 'white',
          bg: 'blue-900'
        }
      }
    },
    {
      provide: 'NgtPaginationActivePageButtonStyle',
      useValue: {
        h: '8',
        w: '8',
        color: {
          text: 'white',
          bg: 'blue-500'
        }
      }
    },
    {
      provide: 'NgtPaginationPageButtonStyle',
      useValue: {
        h: '8',
        w: '8',
        color: {
          text: 'white',
          bg: 'blue-300'
        }
      }
    },
    {
      provide: 'NgtCheckboxStyle',
      useValue: {
        color: {
          bg: 'green-500'
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
    },
    {
      provide: 'NgtSectionStyle',
      useValue: {
        h: '8',
        w: '8',
        my: '1',
        pr: '1',
        color: {
          text: 'text-red-500'
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
