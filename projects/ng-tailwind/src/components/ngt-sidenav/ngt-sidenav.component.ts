import { AfterViewInit, Component, HostListener, Injector, Input, Optional, Self, SimpleChanges } from '@angular/core';

import { fadeDownAnimation } from '../../animations/ngt-angular-animations';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { Size } from '../../enums/size.enum';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-sidenav',
  templateUrl: './ngt-sidenav.component.html',
  styleUrls: ['./ngt-sidenav.component.css'],
  animations: [
    fadeDownAnimation('fadeDownAnimation', 600)
  ],
})

export class NgtSidenavComponent implements AfterViewInit {
  @Input() public size: Size = Size.XS;
  @Input() public initVisible: boolean = false;
  @Input() public closeMenuOnMobileView: boolean = true;

  public visible: boolean = false;
  public open: boolean = false;
  public isMenuContracted: boolean = false;
  public ngtStyle: NgtStylizableService;

  private screenWidth: number;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStyleDirective: NgtStylizableDirective,
  ) {
    if (this.ngtStyleDirective) {
      this.ngtStyle = this.ngtStyleDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'Sidenav', {
      h: 'md:h-auto h-screen',
      color: {}
    });

    this.bindScreenSize();
  }

  ngAfterViewInit() {
    if (this.initVisible) {
      setTimeout(() => {
        this.visible = true;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.size) {
      this.size = getEnumFromString(changes.size.currentValue, Size);
    }
  }

  toggleMenu() {
    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  closeMenu() {
    this.open = false;
  }

  openMenu() {
    this.open = true;
  }

  getNavSize() {
    switch (this.size) {
      case Size.AUTO: return 'md:w-auto w-4/12';
      case Size.XS: return 'md:w-1/12 w-4/12';
      case Size.SM: return 'md:w-2/12 w-5/12';
      case Size.MD: return 'md:w-4/12 w-6/12';
      case Size.XL: return 'md:w-6/12 w-full';
      case Size.FULL: return 'w-full';
    }
  }

  getContainerSize() {
    if (!this.visible) {
      return 'w-full';
    }

    if (this.isMobileView()) {
      return 'w-full';
    }

    switch (this.size) {
      case Size.AUTO: return 'w-full'
      case Size.XS: return 'md:w-11/12 w-full';
      case Size.SM: return 'md:w-10/12 w-full';
      case Size.MD: return 'md:w-8/12 w-full';
      case Size.XL: return 'md:w-6/12 w-full';
      case Size.FULL: return 'w-full';
    }
  }

  toggleMenuSize(size: Size) {
    if (this.isMenuContracted) {
      this.size = size;
      this.isMenuContracted = false;
    } else {
      this.size = Size.AUTO;
      this.isMenuContracted = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  bindScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  isMobileView() {
    if (!this.closeMenuOnMobileView) {
      return false;
    }

    return this.screenWidth < 1024;
  }
}
