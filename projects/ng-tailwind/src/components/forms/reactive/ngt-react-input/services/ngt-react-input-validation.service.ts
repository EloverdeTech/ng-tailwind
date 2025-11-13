import { Injectable, Optional } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, ValidatorFn, Validators } from "@angular/forms";
import { validateCNPJ, validateCPF } from "../../../../../helpers/validators/validation.helper";
import { NgtHttpValidationResponse, NgtHttpValidationService } from "../../../../../services/http/ngt-http-validation.service";
import { NgtReactInputLoaderService } from "./ngt-react-input-loader.service";
import { NgtReactiveFormValidationService } from "../../../../../services/validation/ngt-reactive-form-validation.service";
import { InputMaskEnum } from "../../../../../helpers/input-mask/input-mask.helper";

export interface NgtReactInputValidationConfig {
    type: string;
    mask: InputMaskEnum;
    match: string;
    minValue: number;
    maxValue: number;
    minLength: number;
    maxLength: number;
    isRequired: boolean;
    validatePassword: boolean;
    passwordableId: string;
    passwordPolicyId: string;
    uniqueResource: any;
    customSyncValidators?: ValidatorFn[];
    customAsyncValidators?: AsyncValidatorFn[];
}

@Injectable({ providedIn: null })
export class NgtReactInputValidationService {
    private emailValidatorTimeout: NodeJS.Timeout;
    private passwordValidatorTimeout: NodeJS.Timeout;
    private uniqueValidatorTimeout: NodeJS.Timeout;

    public constructor(
        @Optional() private httpValidationService: NgtHttpValidationService,
        private reactiveFormValidationService: NgtReactiveFormValidationService,
        private loaderService: NgtReactInputLoaderService,
    ) { }

    public getSyncValidators(config: NgtReactInputValidationConfig): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (config.type === 'email') {
            validators.push(Validators.email);
        }

        if (
            config.mask === 'cnpj-cpf'
            || config.mask === 'cnpj-cpf-rut'
            || config.mask === 'cpf'
        ) {
            validators.push(this.cnpjCpfValidator());
        }

        if (config.mask === 'time') {
            validators.push(this.timeValidator());
        }

        validators.push(
            ...this.reactiveFormValidationService.getSyncValidators(config)
        );

        return validators;
    }

    public getAsyncValidators(config: NgtReactInputValidationConfig): AsyncValidatorFn[] {
        const validators: AsyncValidatorFn[] = [];

        if (this.httpValidationService) {
            if (config.uniqueResource) {
                validators.push(this.uniqueValidator(config.uniqueResource));
            }

            if (['email', 'login'].includes(config.type)) {
                validators.push(this.emailValidator(config.type));
            }

            if (config.type === 'password' && config.validatePassword) {
                validators.push(
                    this.passwordValidator(config.passwordableId, config.passwordPolicyId)
                );
            }
        }

        validators.push(
            ...this.reactiveFormValidationService.getAsyncValidators(config)
        );

        return validators;
    }

    public async validatePhone(phone: string): Promise<any> {
        if (!this.httpValidationService) {
            return;
        }

        return this.httpValidationService.phoneValidation(phone)
            .then((result: any) => result);
    }

    private timeValidator(): ValidatorFn {
        const regexExp = new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');

        return (control: AbstractControl) => control.value && !regexExp.test(control.value) ? { 'time': true } : null;
    }

    private cnpjCpfValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }

            const result = this.validateCpfCnpj(control.value);

            if (result.valid) {
                return null;
            }

            return { [result.type]: true };
        };
    }

    private validateCpfCnpj(value: string): { valid: boolean; type?: 'cpf' | 'cnpj' } {
        const cleanValue = value.replace(/[^\d]/g, '');

        if (cleanValue.length <= 11) {
            return {
                valid: validateCPF(cleanValue),
                type: 'cpf'
            };
        } else if (cleanValue.length === 12) {
            return { valid: true };
        } else {
            return {
                valid: validateCNPJ(cleanValue),
                type: 'cnpj'
            };
        }
    }

    private uniqueValidator(uniqueResource: any): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (this.uniqueValidatorTimeout) {
                clearTimeout(this.uniqueValidatorTimeout);
            }

            if (control.value && uniqueResource) {
                return new Promise((resolve) => {
                    this.uniqueValidatorTimeout = setTimeout(() => {
                        this.loaderService.loading.set(true);

                        this.httpValidationService.unique(uniqueResource, control.value).then((response: NgtHttpValidationResponse) => {
                            this.loaderService.loading.set(false);

                            resolve(response.valid ? null : { 'unique': true });
                        }).catch(() => {
                            this.loaderService.loading.set(false);

                            resolve(null);
                        });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }

    private emailValidator(inputHtmlType: string): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (this.emailValidatorTimeout) {
                clearTimeout(this.emailValidatorTimeout);
            }

            if (control.value) {
                return new Promise((resolve) => {
                    this.emailValidatorTimeout = setTimeout(() => {
                        this.loaderService.loading.set(true);

                        this.httpValidationService.emailValidation(control.value)
                            .then((response: NgtHttpValidationResponse) => {
                                this.loaderService.loading.set(false);

                                if (inputHtmlType == 'login') {
                                    return resolve(response.valid ? { 'login': true } : null);
                                }

                                resolve(response.valid ? null : { 'email': true });
                            })
                            .catch(() => {
                                this.loaderService.loading.set(false);

                                resolve(null);
                            });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }

    private passwordValidator(
        passwordableId: string,
        passwordPolicyId: string
    ): AsyncValidatorFn {
        return (control: AbstractControl) => {
            if (this.passwordValidatorTimeout) {
                clearTimeout(this.passwordValidatorTimeout);
            }

            if (control.value) {
                return new Promise((resolve) => {
                    this.passwordValidatorTimeout = setTimeout(() => {
                        this.loaderService.loading.set(true);

                        this.httpValidationService.passwordValidation(
                            control.value,
                            passwordableId,
                            passwordPolicyId
                        )
                            .then((response: NgtHttpValidationResponse) => {
                                this.loaderService.loading.set(false);

                                resolve(response.valid ? null : { 'invalid_password': true });
                            })
                            .catch(() => {
                                this.loaderService.loading.set(false);

                                resolve(null);
                            });
                    }, 500);
                });
            }

            return Promise.resolve(null);
        };
    }
}
