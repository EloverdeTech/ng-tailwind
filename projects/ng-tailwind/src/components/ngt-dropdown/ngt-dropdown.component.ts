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

  openMenuOnTouch(menu: any, subMenu: any) {
    if (this.openOnHover) {
      if (this.ngtDropdownContainer) {
        this.ngtDropdownContainer.activeMenu.emit(this);
      } else {
        this.isOpen = true;
      }

      let interval = setInterval(() => {
        if (!menu || !subMenu || !this.isMenuInHover(menu, subMenu)) {
          this.isOpen = false;
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  toggleMenuOnClick() {
    setTimeout(() => {
      if (!this.openOnHover) {
        if (this.ngtDropdownContainer) {
          this.ngtDropdownContainer.activeMenu.emit(this);
        } else {
          this.isOpen = !this.isOpen;
        }
      }
    });
  }

  isMenuInHover(menu: any, subMenu: any) {
    return menu.parentElement.querySelector(':hover') == menu ||
      subMenu.parentElement.querySelector(':hover') == subMenu;
  }
}
