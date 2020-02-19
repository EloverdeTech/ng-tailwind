import { Component, Input, Optional, SkipSelf } from '@angular/core';

import { NgtModalComponent } from '../ngt-modal.component';

@Component({
  selector: 'ngt-modal-header',
  templateUrl: './ngt-modal-header.component.html',
  styleUrls: ['./ngt-modal-header.component.css']
})
export class NgtModalHeaderComponent {
  @Input() ngtModal: NgtModalComponent;

  constructor(
    @Optional() @SkipSelf()
    private ngtModalInstance: NgtModalComponent
  ) {
    if (ngtModalInstance) {
      this.ngtModal = ngtModalInstance;
    }
  }
}
