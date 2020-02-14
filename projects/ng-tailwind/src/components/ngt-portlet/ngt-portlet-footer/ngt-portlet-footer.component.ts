import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-portlet-footer',
  templateUrl: './ngt-portlet-footer.component.html',
  styleUrls: ['./ngt-portlet-footer.component.css']
})
export class NgtPortletFooterComponent {
  @Input() ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'PortletFooter', {
      color: {
        bg: 'gray-200',
        text: 'black'
      }
    });
  }
}
