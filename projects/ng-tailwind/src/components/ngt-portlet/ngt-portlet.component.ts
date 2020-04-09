import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-portlet',
  templateUrl: './ngt-portlet.component.html',
  styleUrls: ['./ngt-portlet.component.css'],
  animations: [
    trigger('fadeUp', [
      state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
      transition(':enter', [
        animate(500)
      ])
    ])
  ]
})
export class NgtPortletComponent {
  @Input() caption: string;
  @Input() icon: string = null;
  @Input() customLayout: boolean = false;
  @Input() withFooter: boolean = false;
  @Input() withBody: boolean = true;

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

    this.ngtStyle.load(this.injector, 'NgtPortlet', {
      h: 'h-auto',
      shadow: 'shadow',
      color: {}
    });
  }
}
