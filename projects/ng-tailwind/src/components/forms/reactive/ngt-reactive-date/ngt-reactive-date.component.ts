import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    Injector,
    input,
    OnDestroy,
    OnInit,
    Optional,
    Self,
    Signal,
    signal,
    SkipSelf,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
} from '@angular/core';
import { ReactiveFormsModule, TouchedChangeEvent, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { english } from 'flatpickr/dist/l10n/default.js';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import moment from 'moment';
import { FlatpickrOptions, EvDatePickerComponent, EvDatePickerModule } from 'ev-date-picker';

import { Subscription } from 'rxjs';
import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { applyInputMask, InputMaskEnum } from '../../../../helpers/input-mask/input-mask.helper';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtReactiveDateFormatterService } from './services/ngt-reactive-date-formatter.service';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

export enum NgtReactiveDateLocale {
    BRAZIL = 'BRAZIL',
    US = 'US'
}

export enum NgtReactiveDateMode {
    SINGLE = 'SINGLE',
    RANGE = 'RANGE'
}

@Component({
    selector: 'ngt-reactive-date',
    templateUrl: './ngt-reactive-date.component.html',
    styleUrls: ['./ngt-reactive-date.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveDateComponent),

        NgtReactiveDateFormatterService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EvDatePickerModule,
        NgtShiningModule,
        NgtValidationModule,
        NgtHelperComponent,
    ],
})
export class NgtReactiveDateComponent extends NgtControlValueAccessor implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('evDatePicker', { static: true }) public evDatePicker: EvDatePickerComponent;

    /** Visual Inputs */

    public readonly label = input<string>('');
    public readonly placeholder = input<string>('dd/mm/yyyy');
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly dateFormat = input<string>('d/m/Y H:i');
    public readonly internalDateFormat = input<string>('YYYY-MM-DD HH:mm:00');
    public readonly showCalendarIcon = input<boolean>(false);
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly shining = input<boolean>(false);

    /** Behavior Inputs */

    public readonly mode = input<NgtReactiveDateMode | string>(NgtReactiveDateMode.SINGLE);
    public readonly locale = input<NgtReactiveDateLocale | string>(NgtReactiveDateLocale.BRAZIL);
    public readonly minuteIncrement = input<number>(1);
    public readonly defaultDate = input<string>();
    public readonly minDate = input<string>();
    public readonly maxDate = input<string>();
    public readonly allowInput = input<boolean>(false);
    public readonly allowClear = input<boolean>(true);
    public readonly enableTime = input<boolean>(true);
    public readonly time_24hr = input<boolean>(true);
    public readonly noCalendar = input<boolean>(false);
    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);

    /** Validation Inputs */

    public readonly isRequired = input<boolean>(false);

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtForm?.shining()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly isReadonlyState: Signal<boolean> = computed(
        () => this.isReadonly() || this.isDisabledState()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly shouldShowClearButton: Signal<boolean> = computed(
        () => !this.isDisabledState() && this.allowClear() && this.currentValue()
    );

    public readonly formattedDisplayValue: Signal<string> = computed(() =>
        this.getFormattedNativeValue()
    );

    public readonly containerClasses: Signal<string> = computed(() =>
        this.getContainerClasses()
    );

    /** Internal Control */

    public ngtStyle: NgtStylizableService;

    public readonly dateConfig: WritableSignal<FlatpickrOptions> = signal(null);
    public readonly nativeValue: WritableSignal<any> = signal(null);

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);

    private lastInputedDateString: string;
    private subscriptions: Subscription[] = [];

    public constructor(
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        private formatterService: NgtReactiveDateFormatterService,

        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();

        this.registerEffects();
    }

    public ngOnInit(): void {
        this.setupDateConfig();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupComponent();
    }

    public ngOnDestroy(): void {
        this.evDatePicker?.flatpickr?.['calendarContainer']?.remove();

        this.destroySubscriptions();
    }

    public change(value: string | string[]): void {
        if (!value || (Array.isArray(value) && !value.length)) {
            return this.clearInput();
        }

        if (value && this.hasChangeBetweenValues(value, this.nativeValue())) {
            if (Array.isArray(value) && value.length == 2) {
                const firstDate = moment(value[0]);
                const secondDate = moment(value[1]);

                if (firstDate.isValid() && secondDate.isValid()) {
                    return this.setDateOnDatePicker(
                        [
                            firstDate.format(this.getMomentDateFormat()),
                            secondDate.format(this.getMomentDateFormat())
                        ]
                    );
                }

                return;
            }

            const date = moment(value);

            if (date.isValid()) {
                return this.setDateOnDatePicker(
                    date.format(this.getMomentDateFormat())
                );
            }

            this.evDatePicker.setDateFromInput('');
            this.clearInput();
        }
    }

    public onNativeChange(value: any, dateStr: string, instance: any, triggerClose: boolean): void {
        if (dateStr && this.allowInput() && !this.enableTime() && dateStr != this.lastInputedDateString) {
            this.lastInputedDateString = dateStr;

            return this.change(this.convertDateToAmericanFormat(dateStr));
        }

        if (!value || (value instanceof Object && !Object.keys(value).length)) {
            if (triggerClose) {
                instance.close();
            }

            return this.clearInput();
        }

        if (this.mode() == NgtReactiveDateMode.RANGE) {
            const dateArray: string[] = [];

            value.forEach(date => {
                date = moment(date);

                if (date?.isValid()) {
                    dateArray.push(date.format(this.internalDateFormat()));
                }
            });

            this.nativeValue.set(dateArray.length == 2 ? dateArray : []);
        } else if (value[0]) {
            const momentValue = moment(value[0]);

            if (momentValue?.isValid()) {
                this.nativeValue.set(momentValue.format(this.internalDateFormat()));
            }
        }

        if (this.hasChangeBetweenValues(this.value, this.nativeValue())) {
            this.value = this.nativeValue();

            this.formControl.setValue(this.nativeValue());

            this.onTouched();
        }
    }

    public clearInput(event?: Event, clearInstance = false): void {
        event?.stopPropagation();

        if (this.hasChangeBetweenValues(this.value, '')) {
            this.value = '';
        }

        if (this.hasChangeBetweenValues(this.nativeValue(), '')) {
            this.nativeValue.set('');
        }

        if (this.hasChangeBetweenValues(this.formControl?.value, '')) {
            this.formControl?.setValue('');
        }

        if (this.evDatePicker && clearInstance) {
            this.evDatePicker.setDateFromInput('');
        }
    }

    private setupComponent(): void {
        this.setupValidators();
        this.setupSubscriptions();

        if (this.defaultDate() && !this.value) {
            this.value = moment(this.defaultDate()).format(this.internalDateFormat());
        }

        if (this.allowInput() && !this.enableTime()) {
            this.setupDateInputMask();
        }
    }

    private setupDateConfig(): void {
        this.dateConfig.set({
            dateFormat: this.dateFormat(),
            mode: this.getDateMode(),
            minuteIncrement: this.minuteIncrement(),
            minDate: this.minDate(),
            maxDate: this.maxDate(),
            time_24hr: this.time_24hr(),
            enableTime: this.enableTime(),
            noCalendar: this.noCalendar(),
            allowInput: this.allowInput() && !this.enableTime(),
            locale: this.getLocale(),
            onChange: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, dateStr, instance, true),
            onClose: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, dateStr, instance, false),
        });
    }

    private setupSubscriptions(): void {
        if (this.formControl) {
            this.subscriptions.push(
                this.formControl.events.subscribe((event) => {
                    if (event instanceof TouchedChangeEvent) {
                        this.touched.set(event.touched);
                    }

                    this.formControlHasErrors.set(!!this.formControl?.errors);
                    this.formControlIsDirty.set(this.formControl?.dirty);
                })
            );
        }
    }

    private registerEffects(): void {
        effect(() => this.setupValidators());
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const syncValidators: ValidatorFn[] = [];

        if (this.isRequired()) {
            syncValidators.push(Validators.required);
        }

        this.formControl.setValidators(syncValidators);
        this.formControl.updateValueAndValidity();

        if (this.value) {
            this.markAsDirty();

            this.formControlHasErrors.set(!!this.formControl.errors);
            this.formControlIsDirty.set(true);
        }
    }

    private setupDateInputMask(): void {
        if (this.locale() == NgtReactiveDateLocale.BRAZIL) {
            return applyInputMask(this.evDatePicker.flatpickr['input'], InputMaskEnum.DATE, { mask: '99/99/9999' });
        }

        if (this.locale() == NgtReactiveDateLocale.US) {
            return applyInputMask(this.evDatePicker.flatpickr['input'], InputMaskEnum.DATE, { mask: '9999-99-99' });
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtDate', {
            h: 'h-10',
            text: 'text-xs',
            px: 'px-4',
            py: 'py-0',
            rounded: 'rounded',
            fontCase: '',
            color: {
                text: 'text-gray-800',
                bg: 'bg-white',
                border: 'border-gray-400 focus:border-gray-700'
            }
        });
    }

    private setDateOnDatePicker(dates: string | string[]): void {
        setTimeout(() => {
            (<any>this.evDatePicker.flatpickr).setDate(
                dates,
                true,
                this.dateFormat()
            );
        });
    }

    private convertDateToAmericanFormat(dateTimeString: string): string {
        return this.formatterService.convertDateByLocale(dateTimeString, this.locale() as NgtReactiveDateLocale);
    }

    private getLocale() {
        return this.locale() == NgtReactiveDateLocale.US
            ? english
            : Portuguese;
    }

    private getDateMode(): 'single' | 'range' {
        return this.mode() == NgtReactiveDateMode.RANGE ? 'range' : 'single';
    }

    private getMomentDateFormat(): string {
        return this.formatterService.convertFlatpickrToMomentFormat(this.dateFormat());
    }

    private getFormattedNativeValue(): string {
        return this.formatterService.formatToDisplay(
            this.nativeValue(),
            this.enableTime(),
            this.dateFormat(),
            this.placeholder()
        );
    }

    private getContainerClasses(): string {
        const classes: string[] = [
            'overflow-hidden border',
            this.ngtStyle.compile(['h', 'color.text', 'px', 'py', 'text', 'rounded', 'color.bg', 'color.border'])
        ];

        if (this.formControlHasErrors() && this.formControlIsDirty() && this.touched()) {
            classes.push('border-error');
        }

        return classes.join(' ');
    }

    private hasChangeBetweenValues(a: any, b: any): boolean {
        return JSON.stringify(a) != JSON.stringify(b);
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
