import { Component } from '@angular/core';
import { NgtFloatingButtonMenu, NgtFloatingButtonType } from 'projects/ng-tailwind/src/public-api';

@Component({
    selector: 'app-ngt-floating-button-page',
    templateUrl: './ngt-floating-button-page.component.html'
})
export class NgtFloatingButtonPageComponent {
    public codeExample = `
  <div class="absolute bottom-0 left-0 m-4">
    <ngt-floating-button [withAnimation]='false' icon='assets/images/icons/button.svg'
      [menus]="floatingButtonOptionsThree" h='h-12' w='w-full' ngt-stylizable>
    </ngt-floating-button>
  </div>

  <div class="absolute bottom-0 m-4">
    <ngt-floating-button label='NgtFloatingButton' [withAnimation]='true'
      icon='assets/images/icons/information_outline.svg' 
      [menus]="floatingButtonOptionsTwo" h='h-12' w='w-full' ngt-stylizable>
    </ngt-floating-button>
  </div>

  <div class="absolute right-0 bottom-0 m-4">
    <ngt-floating-button [withAnimation]='true' icon='assets/images/icons/add_solid.svg'
      [menus]="floatingButtonOptionsOne">
    </ngt-floating-button>
  </div>
  `;

    public optionsCodeExample = `
  public floatingButtonOptionsOne: Array<NgtFloatingButtonMenu> = [
    {
      name: '',
      url: '/docs/installation',
      type: NgtFloatingButtonType.NAVIGATION,
      icon: 'assets/images/icons/plugin.svg',
      tooltip: 'Installation'
    },
    {
      name: '',
      url: 'https://www.google.com',
      type: NgtFloatingButtonType.NAVIGATION,
      icon: 'assets/images/icons/search.svg',
      tooltip: 'Google',
      externalLink: true
    },
  ];

  public floatingButtonOptionsThree: Array<NgtFloatingButtonMenu> = [
    {
      type: NgtFloatingButtonType.ACTION,
      action: () => {
        alert('Action executed!');
      },
      icon: 'assets/images/icons/button.svg',
    },
  ];
  `;

    public floatingButtonOptionsOne: Array<NgtFloatingButtonMenu> = [
        {
            name: '',
            url: '/docs/installation',
            type: NgtFloatingButtonType.NAVIGATION,
            icon: 'assets/images/icons/plugin.svg',
            tooltip: 'Installation'
        },
        {
            name: '',
            url: 'https://www.google.com',
            type: NgtFloatingButtonType.NAVIGATION,
            icon: 'assets/images/icons/search.svg',
            tooltip: 'Google',
            externalLink: true
        },
    ];

    public floatingButtonOptionsTwo: Array<NgtFloatingButtonMenu> = [
        {
            name: 'Installation',
            url: '/docs/installation',
            type: NgtFloatingButtonType.NAVIGATION,
            icon: 'assets/images/icons/plugin.svg',
            tooltip: 'Installation'
        },
        {
            name: 'Google',
            url: 'https://www.google.com',
            type: NgtFloatingButtonType.NAVIGATION,
            icon: 'assets/images/icons/search.svg',
            tooltip: 'Google',
            externalLink: true
        },
    ];

    public floatingButtonOptionsThree: Array<NgtFloatingButtonMenu> = [
        {
            type: NgtFloatingButtonType.ACTION,
            action: () => {
                alert('Action executed!');
            },
            icon: 'assets/images/icons/button.svg',
        },
    ];

    public constructor() { }
}
