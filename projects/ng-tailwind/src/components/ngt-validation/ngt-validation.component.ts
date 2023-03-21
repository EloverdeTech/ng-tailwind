import { Component, Input, Optional } from '@angular/core';
import { ControlContainer, UntypedFormControl } from '@angular/forms';

import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-validation',
    templateUrl: './ngt-validation.component.html'
})
export class NgtValidationComponent {
    @Input() public control: UntypedFormControl;
    @Input() public container: ControlContainer;
    @Input() public minValue: number;
    @Input() public minLength: number;

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }
}
