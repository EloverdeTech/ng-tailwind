import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'ngt-helper',
    templateUrl: './ngt-helper.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtHelperComponent {
    @Input() public icon: string = '';
    @Input() public helpTitle: string = '';
    @Input() public iconColor: string = '';

    public constructor() { }
}
