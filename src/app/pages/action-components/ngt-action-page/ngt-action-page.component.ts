import { Component } from '@angular/core';

@Component({
    selector: 'ngt-action-page',
    templateUrl: './ngt-action-page.component.html'
})
export class NgtActionPageComponent {
    public codeExample = `
  <ngt-action title="Navigation" href='/docs/installation'
    icon="assets/images/icons/cheveron_outline_right.svg" ngt-stylizable
    color.bg='bg-none hover:bg-teal-600' color.text='text-gray-700 hover:text-white text-2xl'
    h='h-10' w='w-10'>
  </ngt-action>

  <ngt-action title="Error" icon="assets/images/icons/close_outline.svg" 
    (click)='errorClick()' ngt-stylizable color.bg='bg-none hover:bg-red-500' 
    color.text='text-gray-700 hover:text-white text-2xl' h='h-10' w='w-10'>
  </ngt-action>

  <ngt-action title="Success" icon="assets/images/icons/checkmark_outline.svg"
    (click)='successClick()' ngt-stylizable color.bg='bg-none hover:bg-green-500'
    color.text='text-gray-700 hover:text-white text-2xl' h='h-10' w='w-10'>
  </ngt-action>

  <ngt-action title="Information" icon="assets/images/icons/information_outline.svg"
    (click)='informationClick()' ngt-stylizable color.bg='bg-none hover:bg-blue-500'
    color.text='text-gray-700 hover:text-white text-2xl' h='h-10' w='w-10'>
  </ngt-action>
  `;

    public constructor() { }

    public errorClick() {
        alert('Ngt Action Error Click!');
    }

    public successClick() {
        alert('Ngt Action Success Click!');
    }

    public informationClick() {
        alert('Ngt Action Information Click!');
    }
}
