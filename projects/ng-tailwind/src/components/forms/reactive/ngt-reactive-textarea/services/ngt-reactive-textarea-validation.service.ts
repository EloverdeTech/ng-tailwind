import { Injectable } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { NgtReactiveFormValidationService } from "../../../../../services/validation/ngt-reactive-form-validation.service";

export interface NgtReactiveTextareaValidationConfig {
    isRequired?: boolean;
    minLength?: number;
    maxLength?: number;
    customSyncValidators?: ValidatorFn[];
    customAsyncValidators?: AsyncValidatorFn[];
}

@Injectable()
export class NgtReactiveTextareaValidationService {
    public constructor(
        private reactiveFormValidationService: NgtReactiveFormValidationService,
    ) { }

    public getSyncValidators(config: NgtReactiveTextareaValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [
            ...this.reactiveFormValidationService.getSyncValidators(config)
        ];

        return validators;
    }

    public getAsyncValidators(config: NgtReactiveTextareaValidationConfig): AsyncValidatorFn[] {
        const validators: AsyncValidatorFn[] = [];

        if (config.customAsyncValidators) {
            validators.push(...config.customAsyncValidators);
        }

        return validators;
    }
}
