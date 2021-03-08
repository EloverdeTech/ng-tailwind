import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Host,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Renderer2,
    Self,
    SimpleChanges,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ControlContainer, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtHttpValidationResponse, NgtHttpValidationService } from '../../services/http/ngt-http-validation.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

let Inputmask = require('inputmask');

@Component({
    selector: 'ngt-input',
    templateUrl: './ngt-input.component.html',
    styleUrls: ['./ngt-input.component.css'],
    providers: [
        NgtMakeProvider(NgtInputComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtInputComponent extends NgtBaseNgModel implements OnInit, OnDestroy {
    @ViewChild("element", { static: true }) public element: ElementRef;

    // Visual
    @Input() public label: string;
    @Input() public placeholder: string = '';
    @Input() public shining: boolean;
    @Input() public loading: boolean;
    @Input() public helpTitle: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helpText: boolean;
    @Input() public innerLeftIcon: string;
    @Input() public innerLeftIconColor: string;
    @Input() public innerRightIcon: string;
    @Input() public innerRightIconColor: string;
    @Input() public decimalMaskPrecision: number = 2;

    //Behavior
    @Input() public isDisabled: boolean;
    @Input() public isReadonly: boolean;
    @Input() public type: string = 'text';
    @Input() public name: string;
    @Input() public mask: string;
    @Input() public focus: boolean;
    @Input() public allowClear: boolean;
    @Input() public jit: boolean;

    //Validations
    @Input() public isRequired: boolean;
    @Input() public uniqueResource: any;
    @Input() public minValue: number;
    @Input() public maxValue: number;
    @Input() public maxLength: number;
    @Input() public minLength: number;
    @Input() public match: string;
    @Input() public multipleOf: number;
    @Input() public externalServerDependency: boolean;

    public componentReady: boolean;
    public inputProperties: {
        htmlType?: string;
        length?: number;
    } = {};

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent,
        private renderer: Renderer2,
        @Optional() @SkipSelf()
        private ngtValidationService: NgtHttpValidationService,
        private changeDetector: ChangeDetectorRef
    ) {
        super();

        if (this.ngtFormComponent) {
            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtInput', {
            h: 'h-12',
            rounded: 'rounded',
            color: {
                border: 'border-gray-400 focus:border-gray-700',
                bg: 'bg-bg-white focus:bg-white',
                text: 'text-gray-800'
            }
        });
    }

    public setFocus() {
        setTimeout(() => {
            this.element.nativeElement.focus();
        }, 200);
    }

    public clearInput(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        this.element.nativeElement.value = '';
        this.value = '';

        this.markAsPristine();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.setupMasks(changes.mask ? changes.mask.previousValue : null);

        if (changes.match || changes.isRequired || changes.type || changes.mask) {
            this.updateValidations();
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public change(value: any) {
        if (value && typeof value === 'string' && this.mask == 'decimal') {
            value = parseFloat(value);
        }

        if (!this.getNativeValue()) {
            this.element.nativeElement.value = value;
        }

        if (!value) {
            this.clearInput();
        }

        let nativeValue = this.getNativeValue();

        if (this.mask) {
            let ngModelValue = this.removeMasks(nativeValue);

            if (nativeValue && ngModelValue != this.value) {
                this.value = ngModelValue;
            }
        } else {
            let ngModelValue = this.removeMasks(value);

            if (value && ngModelValue != value) {
                this.value = ngModelValue;
            }

            if (this.value != nativeValue) {
                this.element.nativeElement.value = ngModelValue;
            }
        }

        if (this.componentReady) {
            this.onValueChangeEvent.emit(this.value);
        }
    }

    public ngOnInit() {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!", this.element.nativeElement);
        }

        if (!this.name) {
            console.error("The element must contain a name attribute!", this.element.nativeElement);
        } else {
            setTimeout(() => {
                this.componentReady = true;
                setTimeout(() => {
                    this.initComponent();

                    if (!this.getElementTitle() || this.getElementTitle() === 'null') {
                        this.element.nativeElement.parentElement.parentElement.title = '';
                    }
                });
            }, 500);
        }
    }

    public getInputPaddings() {
        let paddingClass: string = '';

        if (this.innerLeftIcon) {
            paddingClass += 'pl-8 pr-4 ';
        } else {
            paddingClass += 'px-4 ';
        }

        if (this.innerRightIcon || this.allowClear || this.type == 'password') {
            if (this.allowClear && this.value && (this.innerRightIcon || this.type == 'password')) {
                paddingClass += 'pr-16 ';
            } else {
                paddingClass += 'pr-8 ';
            }
        }

        return paddingClass;
    }

    public showPassword() {
        this.element.nativeElement.type = 'text';
        this.changeDetector.detectChanges();
    }

    public hidePassword() {
        this.element.nativeElement.type = 'password';
        this.changeDetector.detectChanges();
    }

    private initComponent() {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
            if (this.focus) {
                this.setFocus();
            }

            let watch = "change";

            if (this.jit) {
                watch += " keyup keydown keypress";
            }

            watch.split(' ').forEach((evt) => {
                this.renderer.listen(this.element.nativeElement, evt, () => {
                    let nativeValue = this.removeMasks(this.getNativeValue());

                    if (this.value != nativeValue) {
                        this.value = nativeValue;
                    }
                });
            });

            this.renderer.listen(this.element.nativeElement, "keydown", (event) => {
                if (this.element.nativeElement && this.element.nativeElement.value && this.element.nativeElement.value.length >= this.maxLength) {
                    // Backspace and delete
                    if (event.keyCode != 8 && event.keyCode != 46) {
                        event.preventDefault();

                        return false;
                    }
                }
            });

            this.updateValidations();

            if (this.match) {
                this.renderer.listen(this.element.nativeElement, "keypress", () => {
                    this.matchValidator();
                });
            }

            if (this.value) {
                this.formControl.markAsDirty();
            } else {
                this.formControl.markAsPristine();
            }
        } else {
            console.warn("The element must contain a ngModel property", this.element.nativeElement);
        }

        this.setupProperties();
    }

    private updateValidations() {
        if (!this.formControl) {
            return;
        }

        let syncValidators = [];

        if (this.type == "email") {
            syncValidators.push(Validators.email);
        }

        if (this.isRequired) {
            syncValidators.push(Validators.required);
        }

        if (this.maxLength) {
            syncValidators.push(Validators.maxLength(this.maxLength));
        }

        if (this.minLength) {
            syncValidators.push(Validators.minLength(this.minLength));
        }

        if (this.mask == 'cnpj-cpf') {
            syncValidators.push(this.cnpjCpfValidator());
        }

        if (this.mask == 'time') {
            syncValidators.push(this.timeValidator());
        }

        if (this.match) {
            syncValidators.push(this.matchValidator());
        }

        if (this.minValue) {
            syncValidators.push(this.minValueValidator());
        }

        if (this.multipleOf) {
            syncValidators.push(this.multipleOfValidator());
        }

        if (this.externalServerDependency) {
            syncValidators.push(this.externalServerDependencyValidator());
        }

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);

            if (this.uniqueResource) {
                this.formControl.setAsyncValidators([this.uniqueValidator()]);
            }

            this.formControl.updateValueAndValidity();
        });
    }

    private setupMasks(previousMask?: string) {
        if (this.mask != previousMask && !this.mask) {
            Inputmask.remove(this.element.nativeElement);

            return this.clearInput();
        }

        let masks = {
            'cpf': '999.999.999-99',
            'cnpj': '99.999.999/9999-99',
            'decimal': {
                digits: this.decimalMaskPrecision,
                groupSeparator: '.',
                radixPoint: ',',
                autoGroup: true,
                repeat: 16,
                rightAlign: false,
                max: this.maxValue,
            },
            'cnpj-cpf': {
                mask: ['999.999.999-99', '99.999.999/9999-99'],
                keepStatic: true
            },
            'cellphone': {
                mask: ['(99) 9999-9999', '(99) 99999-9999'],
                keepStatic: true
            },
            'plate': {
                mask: ['AAA-9999', 'AAA9A99'],
                keepStatic: true
            },
            'cep': '99999-999',
            'integer': {
                min: '0',
                max: this.maxValue,
                rightAlign: false
            },
            'time': '99:99',
        };

        if (this.mask == "decimal") {
            Inputmask('decimal', masks[this.mask]).mask(this.element.nativeElement);
        } else if (this.mask == "integer") {
            Inputmask("integer", masks[this.mask]).mask(this.element.nativeElement);
        } else {
            Inputmask(masks[this.mask]).mask(this.element.nativeElement);
        }
    }

    private setupProperties() {
        let props = {
            shortText: {
                htmlType: "text",
                length: 20
            },
            text: {
                htmlType: "text",
                length: 60
            },
            longText: {
                htmlType: "text",
                length: 150
            },
            extraLongText: {
                htmlType: "text",
                length: 300
            },
            password: {
                htmlType: "password",
                length: 150
            },
            email: {
                htmlType: "text",
                length: 60,
            },
            decimal: {
                htmlType: "text",
                length: 9,
            }
        };

        if (this.type in props) {
            this.inputProperties = props[this.type];
            this.maxLength = this.inputProperties.length;
        } else {
            console.warn("Type [" + this.type + "] is not a valid tail-form-input type!", this.element.nativeElement);
        }
    }

    private minValueValidator() {
        return (control: AbstractControl) => {
            if (control.value) {
                return (parseFloat(control.value) <= this.minValue) ? { 'minValue': true } : null;
            }
        };
    }

    private multipleOfValidator() {
        return (control: AbstractControl) => {
            if (control.value) {
                return (control.value % this.multipleOf !== 0) ? { 'multipleOf': true } : null;
            }
        };
    }

    private externalServerDependencyValidator() {
        // TODO: Validar tempo de requisição
        return (control: AbstractControl) => !control.value ? { 'externalServerDependency': true } : null;
    }

    private timeValidator() {
        const regexExp = new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');

        return (control: AbstractControl) => {
            if (control.value) {
                if (regexExp.test(control.value)) {
                    return null;
                } else {
                    return { 'time': true };
                }
            }
        };
    }

    private cnpjCpfValidator() {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }

            if (control.value && control.value.length <= 11) {
                if (this.validatorCPF(control.value)) {
                    return null;
                } else {
                    return { 'cpf': true };
                }
            } else {
                if (control.value && this.validatorCNPJ(control.value)) {
                    return null;
                } else {
                    return { 'cnpj': true };
                }
            }
        };
    }

    private matchValidator() {
        return (control: AbstractControl) => {
            if (this.value != this.match) {
                return { 'match': true };
            } else {
                return null;
            }
        };
    }

    private uniqueValidator(): AsyncValidatorFn {
        if (!this.ngtValidationService) {
            throw new Error("In order to use uniqueValidation you must provide a implementation for NgtHttpValidationService class!");
        }

        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (this.value && this.uniqueResource) {
                return new Promise((resolve) => {
                    this.loading = true;

                    this.ngtValidationService.unique(this.uniqueResource, this.value).then((response: NgtHttpValidationResponse) => {
                        this.loading = false;

                        if (!response.valid) {
                            return resolve({ 'unique': true });
                        }

                        resolve(null);
                    }).catch(() => {
                        this.loading = false;
                        resolve({ 'unique': true });
                    });
                });
            }

            return Promise.resolve(null);
        };
    }

    private validatorCNPJ(value) {
        let b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        if ((value = value.replace(/[^\d]/g, "")).length != 14) {
            return false;
        }

        if (/0{14}/.test(value)) {
            return false;
        }

        let n = 0;

        for (let i = 0; i < 12; n += value[i] * b[++i]) {
            ;
        }

        if (value[12] != (((n %= 11) < 2) ? 0 : 11 - n)) {
            return false;
        }

        n = 0;

        for (let i = 0; i <= 12; n += value[i] * b[i++]) {
            ;
        }

        if (value[13] != (((n %= 11) < 2) ? 0 : 11 - n)) {
            return false;
        }

        return true;
    };

    private validatorCPF(value) {
        let numeros, digitos, soma, i, resultado, digitos_iguais;

        digitos_iguais = 1;

        if (value.length < 11) {
            return false;
        }

        for (i = 0; i < value.length - 1; i++) {
            if (value.charAt(i) != value.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }

        if (!digitos_iguais) {
            numeros = value.substring(0, 9);
            digitos = value.substring(9);
            soma = 0;

            for (i = 10; i > 1; i--) {
                soma += numeros.charAt(10 - i) * i;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0)) {
                return false;
            }

            numeros = value.substring(0, 10);
            soma = 0;

            for (i = 11; i > 1; i--) {
                soma += numeros.charAt(11 - i) * i;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(1)) {
                return false;
            }

            return true;
        } else {
            return false;
        }
    }

    private getNativeValue() {
        return this.element.nativeElement.value;
    }

    private getElementTitle(): string {
        return this.element.nativeElement.parentElement.parentElement.title;
    }

    private removeMasks(value: string) {
        if (this.mask == "decimal") {
            value = (value + "")
                .replace(/\./g, '')
                .replace(',', '.');
        } else if (this.mask == "cnpj-cpf" || this.mask == "cpf" || this.mask == "cnpj") {
            value = (value + "")
                .replace('.', '')
                .replace('.', '')
                .replace('-', '')
                .replace('/', '');
        } else if (this.mask == "cellphone") {
            value = (value + "")
                .replace('(', '')
                .replace(')', '')
                .replace(' ', '')
                .replace('-', '');
        }

        return value;
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
