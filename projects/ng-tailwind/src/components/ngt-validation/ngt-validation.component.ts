import { Component, Input } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

@Component({
    selector: 'ngt-validation',
    templateUrl: './ngt-validation.component.html',
    styleUrls: ['./ngt-validation.component.css']
})
export class NgtValidationComponent {
    @Input() public control: FormControl;
    @Input() public container: ControlContainer;
    @Input() public minValue: number;
    @Input() public minLength: number;

    public constructor() { }
}
