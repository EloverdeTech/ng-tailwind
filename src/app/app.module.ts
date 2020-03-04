import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  NgtActionModule,
  NgtAttachmentHttpService,
  NgtButtonModule,
  NgtCheckboxModule,
  NgtContentModule,
  NgtDatatableModule,
  NgtDateModule,
  NgtDropdownModule,
  NgtDropzoneModule,
  NgtFloatingButtonModule,
  NgtHeaderNavModule,
  NgtHttpService,
  NgtHttpValidationService,
  NgtInputModule,
  NgtModalModule,
  NgtPortletModule,
  NgtSectionModule,
  NgtSelectModule,
  NgtSidenavModule,
  NgtStylizableModule,
  NgtTagModule,
  NgtTextareaModule,
} from 'ng-tailwind';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgtAttachmentHttpServiceTest } from './services/ngt-attachment-http-test.service';
import { NgtHttpTest } from './services/ngt-http-test.service';
import { NgtHttpValidationTestService } from './services/ngt-http-validation-test';

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
    NgtSelectModule,
    NgtDropzoneModule
  ],
  providers: [
    {
      provide: NgtAttachmentHttpService,
      useClass: NgtAttachmentHttpServiceTest
    },
    {
      provide: NgtHttpService,
      useClass: NgtHttpTest
    },
    {
      provide: NgtHttpValidationService,
      useClass: NgtHttpValidationTestService
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
          bg: 'bg-blue-200',
          text: 'text-gray-700'
        }
      },
    },
    {
      provide: 'NgtPortletBodyStyle',
      useValue: {
        color: {}
      },
    },
    {
      provide: 'NgtPortletHeaderStyle',
      useValue: {
        color: {
          bg: 'bg-orange-200',
          text: 'text-gray-700'
        }
      },
    },
    {
      provide: 'NgtPortletFooterStyle',
      useValue: {
        color: {
          bg: 'bg-orange-200',
          text: 'text-gray-900'
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
