import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgtHttpService } from 'projects/ng-tailwind/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
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
      provide: NgtHttpService,
      useClass: NgtHttpTest
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
