import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";

export interface NgtReactiveSelectValidationConfig {
    isRequired: boolean;
    customSyncValidators?: ValidatorFn[];
}

@Injectable({ providedIn: null })
export class NgtReactiveSelectValidationService {
    public getSyncValidators(config: NgtReactiveSelectValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.isRequired) {
            validators.push(this.isRequiredValidator());
        }

        if (config.customSyncValidators?.length) {
            validators.push(...config.customSyncValidators);
        }

        return validators;
    }

    private isRequiredValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            if (Array.isArray(control.value)) {
                return control.value.length > 0
                    ? null
                    : { 'required': true };
            }

            return control.value
                ? null
                : { 'required': true };
        };
    }
}
