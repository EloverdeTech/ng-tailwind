import {
    Component,
    Host,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Self,
    SimpleChanges,
    SkipSelf,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';
import { Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { getEnumFromString } from '../../helpers/enum/enum';
import { uuid } from '../../helpers/uuid';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

const Brazil = require("flatpickr/dist/l10n/pt.js").default.pt;
const US = require("flatpickr/dist/l10n/default.js").default;
let moment = require('moment');

@Component({
    selector: 'ngt-date',
    templateUrl: './ngt-date.component.html',
    styleUrls: ['./ngt-date.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NgtMakeProvider(NgtDateComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtDateComponent extends NgtBaseNgModel implements OnInit, OnDestroy {
    @ViewChild("ng2FlatpickrComponent", { static: true }) public ng2FlatpickrComponent: Ng2FlatpickrComponent;

    // Visual
    @Input() public label: string = "";
    @Input() public placeholder: string = "dd/mm/yyyy";
    @Input() public helpTitle: string;
    @Input() public helpText: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public shining = false;
    @Input() public dateFormat: string = 'd/m/Y H:i';
    @Input() public dateFormatNgModel = 'YYYY-MM-DD HH:mm:00';

    // Behavior
    @Input() public name: string;
    @Input() public isDisabled: boolean = false;
    @Input() public isReadonly: boolean = false;
    @Input() public mode: NgtDateMode;
    @Input() public time_24hr: boolean = true;
    @Input() public enableTime: boolean = true;
    @Input() public noCalendar: boolean = false;
    @Input() public minuteIncrement: number = 1;
    @Input() public allowInput: boolean = false;
    @Input() public locale: NgtDateLocale;
    @Input() public allowClear: boolean = true;
    @Input() public minDate: string;
    @Input() public maxDate: string;
    @Input() public defaultDate: string;

    // Validation
    @Input() public isRequired: boolean = false;

    public ngtStyle: NgtStylizableService;
    public dateConfig: FlatpickrOptions;
    public nativeValue: any;
    public componentReady = false;
    public nativeName = uuid();
    public inputProperties: {
        htmlType?: string;
        length?: number;
    } = {};

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent
    ) {
        super();

        if (this.ngtFormComponent) {
            this.shining = this.ngtFormComponent.isShining();

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

        this.ngtStyle.load(this.injector, 'NgtDate', {
            h: 'h-12',
            text: 'text-sm',
            fontCase: '',
            color: {
                text: 'text-gray-800'
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.isRequired) {
            this.updateValidations();
        }

        if (changes.mode) {
            this.mode = getEnumFromString(changes.mode.currentValue, NgtDateMode);
        }

        if (changes.locale) {
            this.locale = getEnumFromString(changes.locale.currentValue, NgtDateLocale);
        }
    }

    public ngOnInit() {
        this.dateConfig = {
            dateFormat: this.dateFormat,
            mode: this.getDateMode(),
            minuteIncrement: this.minuteIncrement,
            minDate: this.minDate,
            maxDate: this.maxDate,
            time_24hr: this.time_24hr,
            enableTime: this.enableTime,
            noCalendar: this.noCalendar,
            allowInput: this.allowInput,
            locale: this.getLocale(),
            onChange: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, instance, true),
            onClose: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, instance, false),
        };

        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name) {
            console.error("The element must contain a name attribute!");
        } else {
            setTimeout(() => {
                this.componentReady = true;
                setTimeout(() => {
                    this.initComponent();
                });
            }, 500);
        }
    }

    public ngOnDestroy() {
        const flatpickrElement = document.getElementsByClassName('flatpickr-calendar');

        if (flatpickrElement?.length) {
            flatpickrElement[flatpickrElement.length - 1].remove();
        }

        this.destroySubscriptions();
    }

    public clearInput(clearInstance = false) {
        this.value = '';
        this.nativeValue = '';

        if (this.ng2FlatpickrComponent && clearInstance) {
            this.ng2FlatpickrComponent.setDateFromInput('');
        }
    }

    public change(value: any) {
        if (this.componentReady) {
            this.onValueChangeEvent.emit(this.value);
        }

        if (!value || (value instanceof Object && !Object.keys(value).length)) {
            return this.clearInput();
        }

        if (value && value != this.nativeValue) {
            let firstValue = moment(value);

            if ((value instanceof Object && Object.keys(value).length) || (value instanceof Array && value.length)) {
                firstValue = moment(value[0]);

                if (value.length == 2) {
                    firstValue = firstValue;

                    let secondValue = moment(value[1]);

                    if (firstValue.isValid() && secondValue.isValid()) {
                        return (<any>this.ng2FlatpickrComponent.flatpickr).setDate([
                            firstValue.format(this.getMomentDateFormat()),
                            secondValue.format(this.getMomentDateFormat())
                        ], true, this.dateFormat);
                    }
                }
            }

            if (firstValue.isValid()) {
                return (<any>this.ng2FlatpickrComponent.flatpickr).setDate(firstValue.format(this.getMomentDateFormat()), true, this.dateFormat);
            }

            this.ng2FlatpickrComponent.setDateFromInput('');
            this.clearInput();
        }
    }

    public onNativeChange(value: any, instance: any, triggerClose: boolean) {
        if (!value || (value instanceof Object && !Object.keys(value).length)) {
            if (triggerClose) {
                instance.close();
            }

            return this.clearInput();
        }

        if (this.mode == NgtDateMode.RANGE) {
            this.nativeValue = [];

            value.forEach(element => {
                element = moment(element);

                if (element && element.isValid()) {
                    this.nativeValue.push(element.format(this.dateFormatNgModel));
                }
            });
        } else if (value[0]) {
            value = moment(value[0]);

            if (value && value.isValid()) {
                this.nativeValue = value.format(this.dateFormatNgModel);
            }
        }

        if (this.value != this.nativeValue) {
            this.value = this.nativeValue;
        }
    }

    public getNativeValue() {
        let nativeValue: any = this.nativeValue;

        if (nativeValue && nativeValue.format) {
            nativeValue = nativeValue.format(this.dateFormatNgModel);
        }

        return nativeValue;
    }

    public getFormattedNativeValue() {
        let nativeValue: any = this.nativeValue;

        if (nativeValue && Array.isArray(nativeValue)) {
            let formattedNativeValue: string = '';

            nativeValue.forEach(element => {
                element = moment(element);

                if (element.format && !this.enableTime) {
                    formattedNativeValue += element.format('DD/MM/YYYY') + ' ';
                } else if (element.format && this.enableTime) {
                    formattedNativeValue += element.format('DD/MM/YYYY HH:mm:00') + ' ';
                }
            });

            return formattedNativeValue;
        } else if (nativeValue) {
            nativeValue = moment(nativeValue);

            if (nativeValue.format && !this.enableTime) {
                return nativeValue.format('DD/MM/YYYY') + ' ';
            } else if (nativeValue.format && this.enableTime) {
                return nativeValue.format('DD/MM/YYYY HH:mm:00') + ' ';
            }
        }

        return this.placeholder;
    }

    public hasErrors(): boolean {
        return this.formControl?.errors && (this.formControl?.dirty || (this.formContainer && this.formContainer['submitted']));
    }

    private initComponent() {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
            if (this.defaultDate && !this.value) {
                this.value = moment(this.defaultDate).format(this.dateFormatNgModel);
            }

            this.updateValidations();

            if (this.value) {
                this.formControl.markAsDirty();
            } else {
                this.formControl.markAsPristine();
            }
        }
    }

    private updateValidations() {
        if (!this.formControl) {
            return;
        }

        let syncValidators = [];

        if (this.isRequired) {
            syncValidators.push(Validators.required);
        }

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private getLocale() {
        if (this.locale) {
            if (this.locale == NgtDateLocale.BRAZIL) {
                return Brazil;
            }
        }

        return US;
    }

    private getDateMode() {
        if (this.mode) {
            if (this.mode == NgtDateMode.RANGE) {
                return 'range';
            }
        }

        return 'single';
    }

    private getMomentDateFormat() {
        let dateFormat = '';

        for (let i = 0; i < this.dateFormat.length; i++) {
            switch (this.dateFormat.charAt(i)) {
                case 'd':
                    dateFormat += 'DD';
                    break;
                case 'm':
                    dateFormat += 'MM';
                    break;
                case 'M':
                    dateFormat += 'MMM';
                    break;
                case 'Y':
                    dateFormat += 'YYYY';
                    break;
                case '/':
                    dateFormat += '/';
                    break;
                case '-':
                    dateFormat += '-';
                    break;
                case ':':
                    dateFormat += ':';
                    break;
                case 'H':
                    dateFormat += 'HH';
                    break;
                case 'i':
                    dateFormat += 'mm';
                    break;
                case 's':
                    dateFormat += 'ss';
                    break;
                default:
                    if (this.dateFormat.charAt(i) != '.') {
                        dateFormat += this.dateFormat.charAt(i);
                    }
            }
        }

        return dateFormat ? dateFormat : 'DD/MM/YYYY HH:mm:00';
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtDateLocale {
    BRAZIL = 'BRAZIL',
    US = 'US'
}

export enum NgtDateMode {
    SINGLE = 'SINGLE',
    RANGE = 'RANGE'
}
