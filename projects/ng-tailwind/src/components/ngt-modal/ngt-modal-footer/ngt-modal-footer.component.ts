import { Component, Injector, Input, Optional, Self } from '@angular/core';
import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-modal-footer',
    templateUrl: './ngt-modal-footer.component.html',
    standalone: false
})
export class NgtModalFooterComponent {
    @Input() public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.tailStylizableDirective) {
            this.ngtStyle = this.tailStylizableDirective.getNgtStylizableService();
        } else if (!this.ngtStyle) {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtModalFooter', {
            px: 'px-0',
            py: 'py-1'
        });
    }
}
