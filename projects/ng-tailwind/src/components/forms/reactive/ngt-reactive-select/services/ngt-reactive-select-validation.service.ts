import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { NgtReactiveFormValidationService } from "../../../../../services/validation/ngt-reactive-form-validation.service";

export interface NgtReactiveSelectValidationConfig {
    isRequired: boolean;
    multiple: boolean;
    customSyncValidators?: ValidatorFn[];
}

@Injectable({ providedIn: null })
export class NgtReactiveSelectValidationService {
    public constructor(
        private reactiveFormValidationService: NgtReactiveFormValidationService,
    ) { }

    public getSyncValidators(config: NgtReactiveSelectValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.isRequired) {
            validators.push(this.isRequiredValidator(config.multiple));
        }

        if (config.customSyncValidators?.length) {
            validators.push(...config.customSyncValidators);
        }

        validators.push(
            ...this.reactiveFormValidationService.getSyncValidators(config)
        );

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

            return { 'required': true };
        };
    }
}
