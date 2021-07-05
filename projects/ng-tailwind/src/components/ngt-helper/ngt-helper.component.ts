import { Component, ElementRef, Input, Optional, ViewChild, ViewEncapsulation } from '@angular/core';

import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @ViewChild('dropdownRef', { static: true }) public dropdownRef: ElementRef;

    @Input() public icon: string;
    @Input() public helpTitle: string;
    @Input() public iconColor: string;

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }
}
