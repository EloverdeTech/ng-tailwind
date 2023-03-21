import { Component, Input, Optional } from '@angular/core';

import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-form-validation-message',
    templateUrl: './ngt-form-validation-message.component.html',
})
export class NgtFormValidationMessageComponent {
    @Input() public canShowValidationMessage: boolean;
    @Input() public message: string;

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }
}
