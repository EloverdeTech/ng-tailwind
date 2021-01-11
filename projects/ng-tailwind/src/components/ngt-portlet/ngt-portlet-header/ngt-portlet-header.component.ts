import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-portlet-header',
    templateUrl: './ngt-portlet-header.component.html',
    styleUrls: ['./ngt-portlet-header.component.css']
})
export class NgtPortletHeaderComponent {
    @Input() public caption: string;
    @Input() public icon: string = null;

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtPortletHeader', {
            h: 'h-auto',
            w: 'w-auto',
            color: {}
        }, ['NgtPortletStyle']);
    }
}
