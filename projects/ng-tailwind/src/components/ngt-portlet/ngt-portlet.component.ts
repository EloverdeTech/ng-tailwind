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
    @Input() public caption: string;
    @Input() public icon: string = null;
    @Input() public customLayout: boolean = false;
    @Input() public withFooter: boolean = false;
    @Input() public withBody: boolean = true;

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

        this.ngtStyle.load(this.injector, 'NgtPortlet', {
            h: 'h-auto',
            shadow: 'shadow',
            color: {}
        });
    }
}
