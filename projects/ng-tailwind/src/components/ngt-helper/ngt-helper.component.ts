import { Component, Input, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit, Optional } from '@angular/core';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @ViewChild("element", { static: true }) public dropdownRef: ElementRef;

    @Input() public icon: string = '';
    @Input() public helpTitle: string = '';
    @Input() public iconColor: string = '';
    @Input() public showHelperOnTop: boolean = false;

    public constructor(
        private elementRef: ElementRef,
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }

    public reversePositionX(): boolean {
        return (document.documentElement.clientWidth - this.elementRef.nativeElement.getBoundingClientRect().right) >= this.elementRef.nativeElement.getBoundingClientRect().width;
    }
}
