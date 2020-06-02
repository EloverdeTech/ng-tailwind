import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, Optional, SimpleChanges, SkipSelf } from '@angular/core';

import { getEnumFromString } from '../../helpers/enum/enum';
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
  @Input() withArrow: boolean = false;
  @Input() reversePosition: boolean = false;
  @Input() closeOnClick: boolean = false;
  @Input() openMethod: NgtDropdownOpenMethod = NgtDropdownOpenMethod.HOVER;

  public name = uuid();
  public isOpen: boolean = false;

  constructor(
    @Optional() @SkipSelf()
    private ngtDropdownContainer: NgtDropdownContainerComponent
  ) {
    if (this.ngtDropdownContainer) {
      this.ngtDropdownContainer.onActiveDropdownChange.subscribe((activeDropdown: NgtDropdownComponent) => {
        this.isOpen = (activeDropdown.name === this.name);
      });
    }
  }

  public open() {
    this.isOpen = true;

    if (this.ngtDropdownContainer) {
      this.ngtDropdownContainer.setActiveDropdown(this);
    }
  }

  public closeOnSelectOption() {
    if (this.closeOnClick) {
      this.close();
    }
  }

  public close() {
    this.isOpen = false;
  }

  public toggle() {
    setTimeout(() => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });
  }

  public onHover(host, container) {
    if (this.openMethod == NgtDropdownOpenMethod.HOVER && host && container) {
      this.open();
      this.watchHover(host, container);
    }
  }

  public onClick(event: any) {
    if (this.openMethod == NgtDropdownOpenMethod.CLICK) {
      event.preventDefault();
      event.stopPropagation();
      this.toggle();
    }
  }

  public onRightClick(event: any) {
    if (this.openMethod == NgtDropdownOpenMethod.RIGHT_CLICK) {
      event.preventDefault();
      event.stopPropagation();
      this.toggle();
    }
  }

  public watchHover(host, container) {
    let interval = setInterval(() => {
      if (!host || !container || !this.isInHover(host, container)) {
        this.isOpen = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  public isInHover(host: any, container: any) {
    return host.parentElement.querySelector(':hover') == host ||
      container.parentElement.querySelector(':hover') == container;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.openMethod) {
      this.openMethod = getEnumFromString(changes.openMethod.currentValue, NgtDropdownOpenMethod);
    }
  }
}

export enum NgtDropdownOpenMethod {
  CLICK = 'CLICK',
  RIGHT_CLICK = 'RIGHT_CLICK',
  HOVER = 'HOVER'
}
