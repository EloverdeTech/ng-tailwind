import { Component } from '@angular/core';

@Component({
  selector: 'ngt-dropdown-page',
  templateUrl: './ngt-dropdown-page.component.html'
})
export class NgtDropdownPageComponent {
  public ngModelOne: boolean = false;
  public ngModelTwo: boolean = false;
  public ngModelThree: boolean = true;

  public codeExample = `
  <form class="flex w-full justify-around pb-2 border-b">
    <div class="flex items-center">
      <span class="mx-2 font-semibold text-sm">{{ ngModelOne }}</span>
      <ngt-checkbox name='ngtCheckboxOne' label='With Label' [(ngModel)]="ngModelOne">
      </ngt-checkbox>
    </div>

    <div class="flex items-center">
      <span class="mx-2 font-semibold text-sm">{{ ngModelTwo }}</span>
      <ngt-checkbox name='ngtCheckboxTwo' [(ngModel)]="ngModelTwo">
      </ngt-checkbox>
    </div>

    <div class="flex items-center">
      <span class="mx-2 font-semibold text-sm">{{ ngModelThree }}</span>
      <ngt-checkbox name='ngtCheckboxThree' label='With custom stylizable' 
        [(ngModel)]="ngModelThree" color.bg='bg-red-500' ngt-stylizable>
      </ngt-checkbox>
    </div>
  </form>
  `;

  public constructor() { }
}
