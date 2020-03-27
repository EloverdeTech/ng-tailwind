import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgtAttachmentHttpService, NgtHttpFormService, NgtHttpService } from 'projects/ng-tailwind/src/public-api';

import { NgtHttpFormTestService } from '../app/services/ngt-http-form-test.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { NgtAttachmentHttpServiceTest } from './services/ngt-attachment-http-test.service';
import { NgtHttpTest } from './services/ngt-http-test.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule
  ],
  providers: [
    {
      provide: NgtHttpFormService,
      useClass: NgtHttpFormTestService
    },
    {
      provide: NgtHttpService,
      useClass: NgtHttpTest
    },
    {
      provide: NgtAttachmentHttpService,
      useClass: NgtAttachmentHttpServiceTest
    },
    {
      provide: 'NgtPortletStyle',
      useValue: {
        color: {
          bg: 'bg-white',
          text: 'text-gray-800'
        },
        mx: 'mx-3 md:mx-6',
        my: 'my-8',
        h: 'h-auto',
      }
    },
    {
      provide: 'NgtPortletFooterStyle',
      useValue: {
        color: {
          bg: 'bg-gray-200',
          text: 'text-gray-800'
        }
      }
    },
    {
      provide: 'NgtPortletBodyStyle',
      useValue: {
        color: {
          text: 'text-gray-800'
        }
      }
    },
    {
      provide: 'NgtActionStyle',
      useValue: {
        color: {
          bg: 'bg-none hover:bg-teal-600',
          text: 'text-gray-800 hover:text-white text-2xl',
        },
        h: 'h-10',
        w: 'w-10'
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
