import { Component, ViewChild, ElementRef, Input, Injector, Optional, Self } from '@angular/core';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';

@Component({
  selector: 'ngt-header-nav',
  templateUrl: './ngt-header-nav.component.html',
  styleUrls: ['./ngt-header-nav.component.css']
})
export class NgtHeaderNavComponent {

  @ViewChild('element', { static: true }) element: ElementRef;

  @Input() ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'HeaderNav', {
      h: 'auto',
      color: {}
    });
  }

  ngAfterViewInit() {
    this.element.nativeElement.classList.add('tail-animate-fade-up');
  }

}