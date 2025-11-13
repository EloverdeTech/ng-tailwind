import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { ControlContainer, FormGroupDirective, UntypedFormControl } from '@angular/forms';

import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-validation',
    templateUrl: './ngt-validation.component.html',
    standalone: false
})
export class NgtValidationComponent {
    @Input({ required: true }) public control: UntypedFormControl;
    @Input() public container: ControlContainer;
    @Input() public minValue: number;
    @Input() public minLength: number;

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService,

        @Optional() @SkipSelf()
        private formGroup: FormGroupDirective,
    ) { }

    public get isSubmitted(): boolean {
        if (this.formGroup) {
            return this.formGroup.submitted;
        }

        return this.container?.['submitted'];
    }

    public get isDirty(): boolean {
        return this.control?.dirty;
    }

    public get isTouched(): boolean {
        return this.control?.touched;
    }

    public shouldShowError(error: string): boolean {
        return this.hasError(error) && (this.isTouched || this.isSubmitted);
    }

    private hasError(error: string): boolean {
        return this.control?.errors?.[error];
    }
}
