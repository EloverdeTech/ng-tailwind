import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-portlet-header',
    templateUrl: './ngt-portlet-header.component.html'
})
export class NgtPortletHeaderComponent {
    @Input() public caption: string = '';
    @Input() public icon: string = '';
    @Input() public iconSize: string = 'text-xl';
    @Input() public helperTitle: string = '';
    @Input() public helperText: string = '';
    @Input() public helperIconColor: string = '';

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
            text: 'text-xl',
            font: 'font-medium',
            border: 'border-b',
            color: {}
        }, ['NgtPortletStyle']);
    }
}
