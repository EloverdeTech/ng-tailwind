import { Component, Input, Optional, Self, Injector } from '@angular/core';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';

@Component({
  selector: 'ngt-content',
  templateUrl: './ngt-content.component.html',
  styleUrls: ['./ngt-content.component.css']
})
export class NgtContentComponent {

  @Input() ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Self() @Optional() private tailStylizableDirective: NgtStylizableDirective
  ) {
    if (this.tailStylizableDirective) {
      this.ngtStyle = this.tailStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'Content', {
      color: {}
    });
  }

}
