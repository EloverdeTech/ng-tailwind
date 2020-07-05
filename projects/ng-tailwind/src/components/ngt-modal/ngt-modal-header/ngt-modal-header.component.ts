import { Component, Injector, Input, Optional, Self, SkipSelf } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtModalComponent } from '../ngt-modal.component';

@Component({
    selector: 'ngt-modal-header',
    templateUrl: './ngt-modal-header.component.html',
    styleUrls: ['./ngt-modal-header.component.css']
})
export class NgtModalHeaderComponent {
    @Input() public ngtModal: NgtModalComponent;

    public ngtStyle: NgtStylizableService;

    public constructor(
        @Optional() @SkipSelf()
        private ngtModalInstance: NgtModalComponent,
        private injector: Injector,
        @Self() @Optional() private tailStylizableDirective: NgtStylizableDirective,
    ) {
        if (ngtModalInstance) {
            this.ngtModal = ngtModalInstance;
        }

        if (this.tailStylizableDirective) {
            this.ngtStyle = this.tailStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtModalHeader', {
            pb: 'pb-3',
            color: {}
        });
    }
}
