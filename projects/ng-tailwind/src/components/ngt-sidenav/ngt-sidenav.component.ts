import { Component, ElementRef, Injector, Input, Optional, Self, ViewChild } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { Size } from '../../enums/size.enum';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-sidenav',
  templateUrl: './ngt-sidenav.component.html',
  styleUrls: ['./ngt-sidenav.component.css']
})
export class NgtSidenavComponent {
  @Input() public size: Size = Size.xs;

  public visible: boolean = true;
  public open = false;
  public ngtStyle: NgtStylizableService;
  public environment: any;
  public isMenuContracted: boolean = false;

  @ViewChild('element', { static: true }) element: ElementRef;

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
      h: 'auto',
      color: {}
    });
  }

  closeMenu() {
    this.element.nativeElement.classList.add('slide-left');

    setTimeout(() => {
      this.open = false;
    }, 500);
  }

  toggleMenu() {
    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.open = true;
  }

  getNavSize() {
    switch (this.size) {
      case Size.auto: return 'md:w-auto w-4/12';
      case Size.xs: return 'md:w-1/12 w-4/12';
      case Size.sm: return 'md:w-2/12 w-5/12';
      case Size.md: return 'md:w-4/12 w-6/12';
      case Size.xl: return 'md:w-6/12 w-full';
      case Size.full: return 'w-full';
    }
  }

  getContainerSize() {
    if (!this.visible) {
      return 'w-full';
    }

    switch (this.size) {
      case Size.auto: return 'w-full'
      case Size.xs: return 'md:w-11/12 w-full';
      case Size.sm: return 'md:w-10/12 w-full';
      case Size.md: return 'md:w-8/12 w-full';
      case Size.xl: return 'md:w-6/12 w-full';
      case Size.full: return 'w-full';
    }
  }

  ngOnChanges(changes) { }

  toggleMenuSize(size: Size) {
    if (this.isMenuContracted) {
      this.size = size;
      this.isMenuContracted = false;
    } else {
      this.size = Size.auto;
      this.isMenuContracted = true;
    }
  }
}
