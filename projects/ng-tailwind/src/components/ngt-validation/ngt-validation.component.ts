import { Component, Input, Optional } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';

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

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }
}
