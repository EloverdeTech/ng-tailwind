import { Component, Input, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';

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

    private parentOverflowRef: any;

    public constructor(private elementRef: ElementRef) {}

    public reversePositionX(): boolean {
        return (document.documentElement.clientWidth - this.elementRef.nativeElement.getBoundingClientRect().right) >= this.elementRef.nativeElement.getBoundingClientRect().width;
    }
}
