import { Component, EventEmitter, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-modal-header',
    templateUrl: './ngt-modal-header.component.html'
})
export class NgtModalHeaderComponent {
    public static closeModalByHeader: EventEmitter<void> = new EventEmitter();

    @Input() public disableDefaultCloses: boolean;

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private tailStylizableDirective: NgtStylizableDirective,
    ) {
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

    public emitCloseModal(): void {
        NgtModalHeaderComponent.closeModalByHeader.emit();
    }
}
