import { Component, OnInit } from '@angular/core';
import { NgtDateLocale, NgtDateMode } from 'projects/ng-tailwind/src/public-api';

@Component({
    selector: 'app-ngt-date-page',
    templateUrl: './ngt-date-page.component.html'
})
export class NgtDatePageComponent implements OnInit {
    public dateOne: string;
    public dateTwo: string;
    public dateRange: string;
    public dateOneLocale = NgtDateLocale.BRAZIL;
    public dateRangeType = NgtDateMode.RANGE;

    public codeExample = `
  <form class="flex w-full pb-2 border-b">
    <div class="flex flex-wrap w-full justify-center">
      <div class="flex flex-col w-full md:w-3/12 pr-0 md:pr-6 mx-4">
        <ngt-date label='NgtDate (Brazilian format)' [locale]='dateOneLocale'
          placeholder='Selecione...' name='dateOne' [(ngModel)]='dateOne'>
        </ngt-date>
        <span class="my-2 font-semibold text-sm">
          NgModel value: <span class="font-normal">{{ dateOne }}</span>
        </span>
      </div>

      <div class="flex flex-col w-full md:w-3/12 pr-0 md:pr-6 mx-4">
        <ngt-date label='Without time (Custom date format)' 
          placeholder='Selecione...' name='dateTwo' [(ngModel)]='dateTwo' 
          dateFormat='d M. Y' dateFormatNgModel='YYYY-MM-DD' [enableTime]=false>
        </ngt-date>
        <span class="my-2 font-semibold text-sm">
          NgModel value: <span class="font-normal">{{ dateTwo }}</span>
        </span>
      </div>

      <div class="flex flex-col w-full md:w-3/12 pr-0 md:pr-6 mx-4">
        <ngt-date label='NgtDate Range' placeholder='Selecione...' 
          name='dateRange' mode='range' [(ngModel)]='dateRange' 
          dateFormat='Y/m/d' dateFormatNgModel='YYYY-MM-DD'
          [enableTime]='false'>
        </ngt-date>
        <span class="my-2 font-semibold text-sm">
          NgModel value: <span class="font-normal">{{ dateRange }}</span>
        </span>
      </div>
    </div>
  </form>
  `;

    public constructor() { }

    public ngOnInit() { }
}
