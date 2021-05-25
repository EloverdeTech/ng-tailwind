import { Component, ElementRef, Input, Optional, ViewChild, ViewEncapsulation } from '@angular/core';

import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @ViewChild('dropdownRef', { static: true }) public dropdownRef: ElementRef;
    @ViewChild('dropdownContainerRef', { static: true }) public dropdownContainerRef: ElementRef;

    @Input() public icon: string = '';
    @Input() public helpTitle: string = '';
    @Input() public iconColor: string = '';
    @Input() public showHelperOnTop: boolean = false;

    private dropdownContainerXPosition: number;

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }

    public reversePositionX(): boolean {
        this.bindDropdownContainerXPosition();

        return !(this.dropdownContainerXPosition > document.documentElement.clientWidth);
    }

    private bindDropdownContainerXPosition() {
        if (!this.dropdownContainerXPosition && this.dropdownContainerRef.nativeElement.offsetWidth) {
            setTimeout(() => {
                this.dropdownContainerXPosition = this.dropdownContainerRef.nativeElement.getBoundingClientRect().x
                    + this.dropdownContainerRef.nativeElement.offsetWidth;
            });
        }
    }
}
