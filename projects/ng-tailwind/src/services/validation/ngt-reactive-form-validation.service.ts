import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidatorFn, Validators } from "@angular/forms";

export interface NgtReactiveFormValidationConfig {
    match?: string;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    isRequired?: boolean;
    customSyncValidators?: ValidatorFn[];
    customAsyncValidators?: AsyncValidatorFn[];
}

@Injectable({ providedIn: 'root' })
export class NgtReactiveFormValidationService {
    public getSyncValidators(config: NgtReactiveFormValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.isRequired) {
            validators.push(Validators.required);
        }

        if (config.maxLength) {
            validators.push(Validators.maxLength(config.maxLength));
        }

        if (config.minLength) {
            validators.push(Validators.minLength(config.minLength));
        }

        if (config.match) {
            validators.push(this.matchValidator(config.match));
        }

        if (config.minValue !== undefined) {
            validators.push(this.minValueValidator(config.minValue));
        }

        if (config.customSyncValidators?.length) {
            validators.push(...config.customSyncValidators);
        }

        return validators;
    }

    public getAsyncValidators(config: NgtReactiveFormValidationConfig): AsyncValidatorFn[] {
        const validators: AsyncValidatorFn[] = [];

        if (config.customAsyncValidators?.length) {
            validators.push(...config.customAsyncValidators);
        }

        return validators;
    }

    private matchValidator(match: string): ValidatorFn {
        return (control: AbstractControl) => control.value !== match ? { 'match': true } : null;
    }

    private minValueValidator(minValue: number): ValidatorFn {
        return (control: AbstractControl) => {
            const value = parseFloat(control.value);

            return !isNaN(value) && value < minValue ? { 'minValue': true } : null;
        };
    }
}
