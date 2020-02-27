import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, Optional, SkipSelf } from '@angular/core';

import { uuid } from '../../helpers/uuid';
import { NgtDropdownContainerComponent } from './ngt-dropdown-container/ngt-dropdown-container.component';

@Component({
  selector: 'ngt-dropdown',
  templateUrl: './ngt-dropdown.component.html',
  styleUrls: ['./ngt-dropdown.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({ opacity: 1, transform: 'translateY(0px)' })),
      state('closed', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('closed => open', [
        animate(300)
      ]),
    ]),
  ]
})
export class NgtDropdownComponent {
  @Input() icon: string;
  @Input() iconClass: string = 'text-xl self-center mr-3 text-white';
  @Input() imageIcon: string;
  @Input() label: string;
  @Input() labelClass: string = 'text-md font-semibold mr-4 text-white';
  @Input() headerBg: any;
  @Input() withFooter: boolean = false;
  @Input() badge: any;
  @Input() withHeader: boolean = true;
  @Input() withArrow: boolean = true;
  @Input() reversePosition: boolean = false;
  @Input() openOnHover: boolean = true;

  public name = uuid();
  public isOpen: boolean = false;

  constructor(
    @Optional() @SkipSelf()
    private ngtDropdownContainer: NgtDropdownContainerComponent
  ) {
    if (this.ngtDropdownContainer) {
      this.ngtDropdownContainer.activeMenu.subscribe((activeMenu) => {
        this.isOpen = (activeMenu === this);
      });
    }
  }

  open() {
    if (this.ngtDropdownContainer) {
      this.ngtDropdownContainer.activeMenu.emit(this);
    } else {
      this.isOpen = true;
    }
  }

  close() {
    this.isOpen = false;
  }

  toogle() {
    setTimeout(() => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });
  }

  onHover(host, container) {
    if (this.openOnHover && host && container) {
      this.open();
      this.watchHover(host, container);
    }
  }

  onClick() {
    if (!this.openOnHover) {
      this.toogle();
    }
  }

  watchHover(host, container) {
    let interval = setInterval(() => {
      if (!host || !container || !this.isInHover(host, container)) {
        this.isOpen = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  isInHover(host: any, container: any) {
    return host.parentElement.querySelector(':hover') == host ||
      container.parentElement.querySelector(':hover') == container;
  }
}