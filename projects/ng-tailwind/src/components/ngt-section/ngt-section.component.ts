import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-section',
  templateUrl: './ngt-section.component.html',
  styleUrls: ['./ngt-section.component.css']
})
export class NgtSectionComponent {

  @Input() icon: string;
  @Input() caption: string;
  @Input() subtitle: string;
  @Input() accordion = false;

  public ngtStyle: NgtStylizableService;
  public showSection = true;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'NgtSection', {
      h: 'h-12',
      w: 'w-12',
      my: 'my-1',
      pr: 'pr-1',
      color: {
        text: 'text-gray-500'
      }
    });
  }

  toogleSectionVisibility() {
    this.showSection = !this.showSection;
  }
}
