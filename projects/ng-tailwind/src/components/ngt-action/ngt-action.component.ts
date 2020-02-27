import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-action',
  templateUrl: './ngt-action.component.html',
  styleUrls: ['./ngt-action.component.css']
})
export class NgtActionComponent {
  @Input() public href: string;
  @Input() public icon: string;
  @Input() public ngtStyle: NgtStylizableService;
  @Input() public isDisabled: boolean;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'NgtAction', {
      h: 'full',
      w: 'full',
      color: {
        bg: 'gray-500',
        text: 'white'
      }
    });
  }

  onClick(event: Event) {
    if (this.isDisabled) {
      event.stopPropagation();
    }
  }
}