import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

export interface NgtDropzoneValidationConfig {
    minItems: number;
    isRequired: boolean;
    customSyncValidators?: ValidatorFn[];
}

@Injectable()
export class NgtReactiveDropzoneValidationService {
    public getSyncValidators(config: NgtDropzoneValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.minItems) {
            validators.push(Validators.minLength(config.minItems));
        }

        if (config.isRequired) {
            validators.push(Validators.required);
        }

        if (config.customSyncValidators?.length) {
            validators.push(...config.customSyncValidators);
        }

        return validators;
    }
}
