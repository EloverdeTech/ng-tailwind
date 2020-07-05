import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-content',
    templateUrl: './ngt-content.component.html',
    styleUrls: ['./ngt-content.component.css']
})
export class NgtContentComponent {
    @Input() public ngtStyle: NgtStylizableService;

    public constructor(
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
