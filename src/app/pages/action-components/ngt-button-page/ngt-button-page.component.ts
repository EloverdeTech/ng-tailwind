import { Component } from '@angular/core';

@Component({
    selector: 'app-ngt-button-page',
    templateUrl: './ngt-button-page.component.html',
    styleUrls: ['./ngt-button-page.component.css']
})
export class NgtButtonPageComponent {
    public codeExample = `
  <ngt-button type='success' class="w-3/12 px-4" (click)="successButton()">
    <span class="text-center w-full">Success</span>
  </ngt-button>

  <ngt-button type='danger' class="w-3/12 px-4" (click)="dangerButton()">
    <span class="text-center w-full">Danger</span>
  </ngt-button>

  <ngt-button type='warning' class="w-3/12 px-4" (click)="warningButton()">
    <span class="text-center w-full">Warning</span>
  </ngt-button>

  <ngt-button type='info' class="w-3/12 px-4" (click)="informationButton()">
    <span class="text-center w-full">Information</span>
  </ngt-button>
  `;

    public constructor() { }

    public successButton() {
        alert('Success Button!');
    }

    public dangerButton() {
        alert('Danger Button!');
    }

    public warningButton() {
        alert('Warning Button!');
    }

    public informationButton() {
        alert('Information Button!');
    }
}
