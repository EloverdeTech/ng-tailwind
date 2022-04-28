import { Component, ElementRef, Injector, Input, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @ViewChild('dropdownRef', { static: true }) public dropdownRef: ElementRef;

    @Input() public helpTextColor: string;
    @Input() public helpText: string;
    @Input() public icon: string;
    @Input() public helpTitle: string;
    @Input() public iconColor: string;
    @Input() public iconTitle: string;
    @Input() public tooltipSize: string = 'max-w-xs';

    public ngtStyle: NgtStylizableService;

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,
        @Optional()
        public ngtTranslateService: NgtTranslateService,
        private injector: Injector,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtHelper', {
            text: 'text-sm',
            fontCase: '',
            color: {
                text: 'text-black',
                bg: 'bg-gray-200'
            }
        });
    }
}
