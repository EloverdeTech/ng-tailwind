import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngt-floating-button-page',
  templateUrl: './ngt-floating-button-page.component.html',
  styleUrls: ['./ngt-floating-button-page.component.css']
})
export class NgtFloatingButtonPageComponent {
  public codeExample = `
  <div class="absolute right-0 bottom-0 m-4">
    <ngt-floating-button [withAnimation]='true' icon='assets/images/icons/add_solid.svg'
      [menus]="floatingButtonOptionsOne">
    </ngt-floating-button>
  </div>

  <div class="absolute bottom-0 left-0 m-4">
    <ngt-floating-button label='NgtFloatingButton' [withAnimation]='true' 
      icon='assets/images/icons/add_solid.svg' [menus]="floatingButtonOptionsTwo"
      h='h-12' w='w-full' ngt-stylizable>
    </ngt-floating-button>
  </div>
  `;

  public floatingButtonOptionsOne = [
    {
      name: '',
      url: '/docs/installation',
      icon: 'assets/images/icons/plugin.svg',
      iconStyle: 'py-4',
      tooltip: 'Installation'
    },
    {
      name: '',
      url: 'https://www.google.com',
      icon: 'assets/images/icons/search.svg',
      iconStyle: 'py-4',
      tooltip: 'Google',
      externalLink: true
    },
  ];

  public floatingButtonOptionsTwo = [
    {
      name: 'Installation',
      url: '/docs/installation',
      icon: 'assets/images/icons/plugin.svg',
      iconStyle: 'py-4',
      tooltip: 'Installation'
    },
    {
      name: 'Google',
      url: 'https://www.google.com',
      icon: 'assets/images/icons/search.svg',
      iconStyle: 'py-4',
      tooltip: 'Google',
      externalLink: true
    },
  ];

  constructor() { }
}
