import { Component, Optional, SkipSelf } from '@angular/core';
import { NgtTranslateService } from 'projects/ng-tailwind/src/services/http/ngt-translate.service';

import { NgtFormComponent } from '../ngt-form.component';

@Component({
    selector: 'ngt-form-validation-message',
    templateUrl: './ngt-form-validation-message.component.html',
})
export class NgtFormValidationMessageComponent {
    public constructor(
        @Optional() @SkipSelf()
        public ngtForm: NgtFormComponent,
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        if (!ngtForm) {
            console.error('The ngt-form-validation-message must be inside a ngt-form!');
        }
    }
}
