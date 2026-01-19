import {
    ChangeDetectionStrategy,
    Component,
    Optional,
    SkipSelf,
    computed,
    input,
} from '@angular/core';
import { ControlContainer, FormGroupDirective, UntypedFormControl } from '@angular/forms';

import { NgtTranslateService } from '../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-validation',
    templateUrl: './ngt-validation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtValidationComponent {
    /** Inputs */

    public readonly control = input.required<UntypedFormControl>();
    public readonly container = input<ControlContainer>();
    public readonly minValue = input<number>();
    public readonly minLength = input<number>();
    public readonly minItems = input<number>();

    /** Computed Signals */

    public readonly isSubmitted = computed(() => {
        if (this.formGroup) {
            return this.formGroup.submitted;
        }

        return (this.container() as any)?.submitted;
    });

    public readonly isDirty = computed(() => this.control()?.dirty);

    public readonly isTouched = computed(() => this.control()?.touched);

    public constructor(
        @Optional()
        public ngtTranslateService: NgtTranslateService,

        @Optional() @SkipSelf()
        private formGroup: FormGroupDirective,
    ) { }

    public shouldShowError(error: string): boolean {
        return this.hasError(error) && (this.isTouched() || this.isSubmitted());
    }

    private hasError(error: string): boolean {
        return this.control()?.errors?.[error];
    }
}
