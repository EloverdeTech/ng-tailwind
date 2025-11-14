import { ChangeDetectionStrategy, Component, input, Optional } from '@angular/core';

import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-form-validation-message',
    templateUrl: './ngt-form-validation-message.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class NgtFormValidationMessageComponent {
    public readonly canShowValidationMessage = input<boolean>();
    public readonly message = input<string>();

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) { }
}
