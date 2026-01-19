import { Injectable, Optional } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import { InputMaskEnum } from '../../../../../helpers/input-mask/input-mask.helper';
import { validateCNPJ, validateCPF } from '../../../../../helpers/validators/validation.helper';
import { NgtHttpValidationService, NgtHttpValidationResponse } from '../../../../../services/http/ngt-http-validation.service';

export interface NgtInputValidationConfig {
    type?: string;
    mask?: InputMaskEnum | string;
    match?: string;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    isRequired?: boolean;
    validatePassword?: boolean;
    passwordableId?: string;
    passwordPolicyId?: string;
    uniqueResource?: any;
    multipleOf?: number;
    externalServerDependency?: boolean;
    customValidator?: () => AsyncValidatorFn;
}

@Injectable()
export class NgtInputValidationService {
    private emailValidatorTimeout: any;
    private passwordValidatorTimeout: any;
    private uniqueValidatorTimeout: any;

    public constructor(
        @Optional()
        private ngtHttpValidationService: NgtHttpValidationService
    ) {}

    public getSyncValidators(config: NgtInputValidationConfig, currentValue: any): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.type === 'email') {
            validators.push(Validators.email);
        }

        if (config.isRequired) {
            validators.push(Validators.required);
        }

        if (config.maxLength) {
            validators.push(Validators.maxLength(config.maxLength));
        }

        if (config.minLength) {
            validators.push(Validators.minLength(config.minLength));
        }

        if (config.mask === 'cnpj-cpf' || config.mask === 'cnpj-cpf-rut' || config.mask === 'cpf') {
            validators.push(this.cnpjCpfValidator());
        }

        if (config.mask === 'time') {
            validators.push(this.timeValidator());
        }

        if (config.match) {
            validators.push(this.matchValidator(config.match, currentValue));
        }

        if (config.minValue !== undefined) {
            validators.push(this.minValueValidator(config.minValue));
        }

        if (config.multipleOf) {
            validators.push(this.multipleOfValidator(config.multipleOf));
        }

        if (config.externalServerDependency) {
            validators.push(this.externalServerDependencyValidator());
        }

        return validators;
    }

    public getAsyncValidators(config: NgtInputValidationConfig, setLoading: (loading: boolean) => void, currentValue: any, isLoginValidation: boolean = false): AsyncValidatorFn[] {
        const validators: AsyncValidatorFn[] = [];

        if (config.type === 'email' && this.hasEmailValidation()) {
            validators.push(this.emailValidator(setLoading, currentValue, isLoginValidation));
        }

        if (config.validatePassword && this.hasPasswordValidation()) {
            validators.push(this.passwordValidator(setLoading, currentValue, config.passwordableId, config.passwordPolicyId));
        }

        if (config.uniqueResource) {
            validators.push(this.uniqueValidator(setLoading, currentValue, config.uniqueResource));
        }

        if (config.customValidator) {
            validators.push(config.customValidator());
        }

        return validators;
    }

    public clearTimeouts(): void {
        if (this.emailValidatorTimeout) {
            clearTimeout(this.emailValidatorTimeout);
        }

        if (this.passwordValidatorTimeout) {
            clearTimeout(this.passwordValidatorTimeout);
        }

        if (this.uniqueValidatorTimeout) {
            clearTimeout(this.uniqueValidatorTimeout);
        }
    }

    private hasEmailValidation(): boolean {
        return typeof this.ngtHttpValidationService?.emailValidation === 'function';
    }

    private hasPasswordValidation(): boolean {
        return typeof this.ngtHttpValidationService?.passwordValidation === 'function';
    }

    private minValueValidator(minValue: number): ValidatorFn {
        return (control: AbstractControl) => parseFloat(control.value) < minValue ? { 'minValue': true } : null;
    }

    private multipleOfValidator(multipleOf: number): ValidatorFn {
        return (control: AbstractControl) => {
            if (control.value) {
                return (control.value % multipleOf !== 0) ? { 'multipleOf': true } : null;
            }

            return null;
        };
    }

    private externalServerDependencyValidator(): ValidatorFn {
        return (control: AbstractControl) => !control.value ? { 'externalServerDependency': true } : null;
    }

    private timeValidator(): ValidatorFn {
        const regexExp = new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');

        return (control: AbstractControl) => {
            if (control.value) {
                if (regexExp.test(control.value)) {
                    return null;
                } else {
                    return { 'time': true };
                }
            }

            return null;
        };
    }

    private cnpjCpfValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }

            if (control.value && control.value.length <= 11) {
                if (validateCPF(control.value)) {
                    return null;
                } else {
                    return { 'cpf': true };
                }
            } else if (control.value && control.value.length === 12) {
                return null;
            } else {
                if (control.value && validateCNPJ(control.value)) {
                    return null;
                } else {
                    return { 'cnpj': true };
                }
            }
        };
    }

    private matchValidator(match: string, currentValue: any): ValidatorFn {
        return (control: AbstractControl) => {
            if (currentValue !== match) {
                return { 'match': true };
            } else {
                return null;
            }
        };
    }

    private emailValidator(setLoading: (loading: boolean) => void, currentValue: any, isLoginValidation: boolean): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (this.emailValidatorTimeout) {
                clearTimeout(this.emailValidatorTimeout);
            }

            if (currentValue) {
                return new Promise((resolve) => {
                    this.emailValidatorTimeout = setTimeout(() => {
                        setLoading(true);

                        this.ngtHttpValidationService.emailValidation(currentValue)
                            .then((response: NgtHttpValidationResponse) => {
                                setLoading(false);

                                if (isLoginValidation) {
                                    resolve(response.valid ? { 'login': true } : null);
                                }

                                resolve(response.valid ? null : { 'email': true });
                            })
                            .catch(() => {
                                setLoading(false);
                                resolve(null);
                            });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }

    private passwordValidator(setLoading: (loading: boolean) => void, currentValue: any, passwordableId: string, passwordPolicyId: string): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (this.passwordValidatorTimeout) {
                clearTimeout(this.passwordValidatorTimeout);
            }

            if (currentValue) {
                return new Promise((resolve) => {
                    this.passwordValidatorTimeout = setTimeout(() => {
                        setLoading(true);

                        this.ngtHttpValidationService.passwordValidation(currentValue, passwordableId, passwordPolicyId)
                            .then((response: NgtHttpValidationResponse) => {
                                setLoading(false);

                                resolve(response.valid ? null : { 'invalid_password': true });
                            })
                            .catch(() => {
                                setLoading(false);
                                resolve(null);
                            });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }

    private uniqueValidator(setLoading: (loading: boolean) => void, currentValue: any, uniqueResource: any): AsyncValidatorFn {
        if (!this.ngtHttpValidationService) {
            throw new Error("In order to use unique validation you must provide an implementation for NgtHttpValidationService class!");
        }

        return (control: AbstractControl) => {
            if (this.uniqueValidatorTimeout) {
                clearTimeout(this.uniqueValidatorTimeout);
            }

            if (currentValue && uniqueResource) {
                return new Promise((resolve) => {
                    this.uniqueValidatorTimeout = setTimeout(() => {
                        setLoading(true);

                        this.ngtHttpValidationService.unique(uniqueResource, currentValue)
                            .then((response: NgtHttpValidationResponse) => {
                                setLoading(false);
                                resolve(response.valid ? null : { 'unique': true });
                            })
                            .catch(() => {
                                setLoading(false);
                                resolve(null);
                            });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }
}
