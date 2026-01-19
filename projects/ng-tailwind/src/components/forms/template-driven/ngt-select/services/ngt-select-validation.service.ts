import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface NgtSelectValidationConfig {
    isRequired: boolean;
    multiple: boolean;
}

@Injectable({ providedIn: null })
export class NgtSelectValidationService {
    public getSyncValidators(config: NgtSelectValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.isRequired) {
            validators.push(this.isRequiredValidator(config.multiple));
        }

        return validators;
    }

    private isRequiredValidator(multiple: boolean): ValidatorFn {
        return (control: AbstractControl) => {
            if (multiple) {
                if (Array.isArray(control.value) && control.value.length > 0) {
                    return null;
                }
            } else if (control.value && JSON.stringify(control.value)) {
                return null;
            }

            return { required: true };
        };
    }
}
