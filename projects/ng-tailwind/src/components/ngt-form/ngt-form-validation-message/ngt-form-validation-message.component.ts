import { Component, Optional, SkipSelf } from '@angular/core';

import { NgtFormComponent } from '../ngt-form.component';

@Component({
    selector: 'ngt-form-validation-message',
    templateUrl: './ngt-form-validation-message.component.html',
    styleUrls: ['./ngt-form-validation-message.component.css']
})
export class NgtFormValidationMessageComponent {
    public constructor(
        @Optional() @SkipSelf()
        public ngtForm: NgtFormComponent
    ) {
        if (!ngtForm) {
            console.error('The ngt-form-validation-message must be inside a ngt-form!');
        }
    }
}
