import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-shining',
  templateUrl: './ngt-shining.component.html',
  styleUrls: ['./ngt-shining.component.css']
})
export class NgtShiningComponent {
  @Input() shiningWidth: NgtShiningWidth = NgtShiningWidth.xs;

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

    this.ngtStyle.load(this.injector, 'NgtShining', {
      rounded: 'rounded-none',
    });
  }
}

export enum NgtShiningWidth {
  xs = 'xs',
  sm = 'sm',
  lg = 'lg',
  xl = 'xl',
}
