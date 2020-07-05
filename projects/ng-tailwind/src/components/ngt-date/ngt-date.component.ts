import {
    Component,
    Host,
    Injector,
    Input,
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
export class NgtDateComponent extends NgtBaseNgModel implements OnInit {
    @ViewChild("ng2FlatpickrComponent", { static: true }) public ng2FlatpickrComponent: Ng2FlatpickrComponent;

    // Visual
    @Input() public label: string = "";
    @Input() public placeholder: string = "";
    @Input() public helpTitle: string;
    @Input() public helpText = false;
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
    @Input() public minuteIncrement: number = 1;
    @Input() public allowInput: boolean = false;
    @Input() public locale: NgtDateLocale;

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
            this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                this.shining = shining;
            });
        }

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtDate', {
            h: 'h-12',
            color: {
                border: 'border-gray-400 focus:border-gray-700',
                bg: 'bg-bg-white focus:bg-white',
                text: 'text-gray-800'
            }
        });
    }

    public change(value: any) {
        if (this.componentReady) {
            this.onValueChangeEvent.emit(this.value);
        }

        if (value && value != this.nativeValue) {
            this.ng2FlatpickrComponent.setDateFromInput(moment(value).format('DD/MM/YYYY HH:mm:00'));
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.mode) {
            this.mode = getEnumFromString(changes.mode.currentValue, NgtDateMode);
        }

        if (changes.locale) {
            this.locale = getEnumFromString(changes.locale.currentValue, NgtDateLocale);
        }
    }

    public async ngOnInit() {
        this.dateConfig = {
            dateFormat: this.dateFormat,
            mode: this.getDateMode(),
            minuteIncrement: this.minuteIncrement,
            time_24hr: this.time_24hr,
            enableTime: this.enableTime,
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
            // Render delay
            setTimeout(() => { }, 500);
            this.componentReady = true;

            setTimeout(() => {
                this.initComponent();
            });
        }
    }

    public onNativeChange(value: any, instance: any, triggerClose: boolean) {
        if (value === undefined) {
            this.value = '';
            this.nativeValue = '';

            if (triggerClose) {
                instance.close();
            }
        } else {
            if (this.mode == NgtDateMode.RANGE) {
                this.nativeValue = [];
                value.forEach(element => {
                    this.nativeValue.push(moment(element).format(this.dateFormatNgModel));
                });
            } else {
                this.nativeValue = moment(value[0]).format(this.dateFormatNgModel);
            }

            if (this.value != this.nativeValue) {
                this.value = this.nativeValue;
            }
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
    }

    private initComponent() {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
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

        syncValidators.push();

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
}

export enum NgtDateLocale {
    BRAZIL = 'BRAZIL',
    US = 'US'
}

export enum NgtDateMode {
    SINGLE = 'SINGLE',
    RANGE = 'RANGE'
}
