import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-floating-button',
  templateUrl: './ngt-floating-button.component.html',
  styleUrls: ['./ngt-floating-button.component.css'],
  animations: [
    trigger('fadeY', [
      state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition(':enter, :leave', [
        animate(300)
      ])
    ]),

    trigger('openClose', [
      state('open', style({
        transform: 'rotate(180deg)'
      })),
      state('closed', style({
        transform: 'rotate(-180deg)'
      })),
      transition('open => closed', [
        animate('0.5s ease-in')
      ]),
      transition('closed => open', [
        animate('0.5s ease-in')
      ]),
    ]),
  ]
})
export class NgtFloatingButtonComponent {
  @Input() menus: Array<NgtFloatingButtonMenu>;
  @Input() icon: string;
  @Input() label: string;
  @Input() withAnimation: boolean = false;

  public isOpen: boolean = false;
  public ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'NgtFloatingButton', {
      color: {
        bg: 'blue-500',
        text: 'white',
      },
      px: '4',
      py: '4',
      h: '12',
      w: '12'
    });
  }

  toggleMenu() {
    this.isOpen = !(this.isOpen);
  }

  openExternalLink(url: string) {
    window.open(url, "_blank");
    this.toggleMenu();
  }
}

export interface NgtFloatingButtonMenu {
  externalLink: boolean;
  action: string;
  icon: string;
  tooltip: string;
  name: string;
}
