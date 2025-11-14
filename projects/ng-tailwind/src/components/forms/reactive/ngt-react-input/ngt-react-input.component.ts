import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    Injector,
    input,
    OnDestroy,
    Optional,
    output,
    Renderer2,
    Self,
    Signal,
    signal,
    SkipSelf,
    TemplateRef,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { AsyncValidatorFn, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../../../ngt-svg/ngt-svg.module';

import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { InputMaskEnum, removeInputMask } from '../../../../helpers/input-mask/input-mask.helper';
import {
    NgtHttpFindExistingResourceInterface,
    NgtHttpResourceService,
} from '../../../../services/http/ngt-http-resource.service';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtReactFormComponent } from '../../../forms/reactive/ngt-react-form/ngt-react-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtReactInputMaskService } from './services/ngt-react-input-mask.service';
import { NgtReactInputValidationConfig, NgtReactInputValidationService } from './services/ngt-react-input-validation.service';
import { NgtReactInputLoaderService } from './services/ngt-react-input-loader.service';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';

@Component({
    selector: 'ngt-react-input',
    templateUrl: './ngt-react-input.component.html',
    styleUrls: ['./ngt-react-input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactInputComponent),

        NgtReactInputMaskService,
        NgtReactInputValidationService,
        NgtReactInputLoaderService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtShiningModule,
        NgtSvgModule,
        NgtValidationModule,
    ],
})
export class NgtReactInputComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('inputElement', { static: true }) public inputElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly placeholder = input<string>('');

    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');

    public readonly innerLeftIcon = input<string>();
    public readonly innerLeftIconColor = input<string>();
    public readonly innerRightIcon = input<string>();
    public readonly innerRightIconColor = input<string>();
    public readonly customInnerContentTemplate = input<TemplateRef<any>>();

    public readonly showCharactersLength = input<boolean>(false);
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly helperAutoXReverse = input<boolean>(true);
    public readonly shining = input<boolean>(false);
    public readonly loading = input<boolean>(false);

    /** Behavior Inputs */

    public readonly type = input<string>('text');
    public readonly mask = input<InputMaskEnum>();
    public readonly decimalMaskPrecision = input<number>(2);

    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    public readonly focus = input<boolean>(false);
    public readonly allowClear = input<boolean>(false);
    public readonly roundedInnerIcon = input<boolean>(false);

    /** Validation Inputs */

    public readonly findExistingResource = input<NgtHttpFindExistingResourceInterface>();
    public readonly uniqueResource = input<any>();

    public readonly passwordableId = input<string>();
    public readonly passwordPolicyId = input<string>();

    public readonly match = input<string>();
    public readonly customSyncValidators = input<ValidatorFn[]>();
    public readonly customAsyncValidators = input<AsyncValidatorFn[]>();

    public readonly validateMinValueOnMask = input<boolean>(false);
    public readonly allowPhoneValidation = input<boolean>(false);
    public readonly validatePassword = input<boolean>(false);

    public readonly isRequired = input<boolean>(false);
    public readonly minValue = input<number>();
    public readonly maxValue = input<number>();
    public readonly maxLength = input<number>();
    public readonly minLength = input<number>();

    public readonly uppercase = input<boolean>(false);

    /** Outputs */

    public readonly onClickLeftIcon = output<void>();
    public readonly onClickRightIcon = output<void>();
    public readonly validatePhoneResult = output<any>();

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.loaderService.shining() || this.ngtForm.shining()
    );

    public readonly isLoading: Signal<boolean> = computed(
        () => this.loading() || this.loaderService.loading()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly inputPaddingClass: Signal<string> = computed(() => {
        let padding = '';

        if (this.innerLeftIcon() || this.customInnerContentTemplate()) {
            padding += 'pl-10 ';
        } else {
            padding += 'px-4 ';
        }

        if (this.innerRightIcon() || this.allowClear() || this.type() === 'password') {
            if (this.allowClear() && this.currentValue() && (this.innerRightIcon() || this.type() === 'password')) {
                padding += 'pr-10';
            } else {
                padding += 'pr-8';
            }
        }

        return padding.trim();
    });

    public readonly shouldShowClearButton: Signal<boolean> = computed(() =>
        !this.isDisabledState()
        && this.allowClear()
        && this.currentValue()
        && !this.isLoading()
    );

    public readonly shouldShowPasswordIcon: Signal<boolean> = computed(
        () => this.type() === 'password' && this.currentValue()
    );

    public readonly shouldShowRightIcon: Signal<boolean> = computed(
        () => this.innerRightIcon() && this.type() !== 'password'
    );

    public readonly remainingCharacters: Signal<number> = computed(() => {
        if (!this.showCharactersLength() || !this.maxLength()) {
            return null;
        }

        const currentLength = this.currentValue()?.length || 0;
        const remaining = this.maxLength() - currentLength;

        return remaining > 0 ? remaining : 0;
    });

    public readonly inputClasses: Signal<string> = computed(() => {
        const classes: string[] = [
            'flex border appearance-none focus:outline-none leading-tight w-full',
            this.inputPaddingClass(),
            this.ngtStyle.compile(['h', 'text', 'color.border', 'color.bg', 'color.text', 'rounded', 'cursor'])
        ];

        if (this.formControlHasErrors() && this.formControlIsDirty()) {
            classes.push('input-has-error border-red-700');
        }

        return classes.join(' ');
    });

    /** Other */

    public existingResourceId: string;

    /** Internal Control */

    public readonly inputHtmlType: WritableSignal<string> = signal('');
    public readonly maxLengthByHtmlType: WritableSignal<string> = signal('');
    public ngtStyle: NgtStylizableService;

    private phoneValidatorTimeout: NodeJS.Timeout;
    private searchExistingResourceTimeout: NodeJS.Timeout;

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);

    private subscriptions: Subscription[] = [];
    private listeners: Array<() => void> = [];

    public constructor(
        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtResourceService: NgtHttpResourceService,

        @Optional()
        private translateService: NgtTranslateService,

        @Optional() @SkipSelf()
        private ngtForm: NgtReactFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        private validationService: NgtReactInputValidationService,
        private maskService: NgtReactInputMaskService,
        private loaderService: NgtReactInputLoaderService,

        private renderer: Renderer2,
        private changeDetector: ChangeDetectorRef,
        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();

        this.registerEffects();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupComponent();

        if (!this.getElementTitle() || this.getElementTitle() === 'null') {
            this.inputElement.nativeElement.parentElement.parentElement.title = '';
        }
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();

        this.destroyListeners();
    }

    public onNativeChange(): void {
        if (this.hasChangesBetweenModels()) {
            this.value = this.maskService.removeMask(this.getNativeValue());
        }
    }

    public change(value: string | number): void {
        if (value && typeof value === 'string' && this.mask() == InputMaskEnum.DECIMAL) {
            this.value = parseFloat(value);
        }

        if (!this.getNativeValue() || (this.validateMinValueOnMask())) {
            this.setNativeValue(<string>value ?? '');
        }

        this.onValueChangeEvent.emit(this.value);
    }

    public setFocus(): void {
        this.inputElement.nativeElement.focus();
    }

    public clearInput(event?: Event): void {
        event?.stopPropagation();

        this.setNativeValue('');
        this.value = '';
    }

    public restorePlaceholder(): void {
        if (this.placeholder() && this.mask()) {
            setTimeout(() => this.inputElement.nativeElement.placeholder = this.placeholder());
        }
    }

    public showPassword(): void {
        this.inputElement.nativeElement.type = 'text';
        this.changeDetector.detectChanges();
    }

    public hidePassword(): void {
        this.inputElement.nativeElement.type = 'password';
        this.changeDetector.detectChanges();
    }

    public getTranslation(key: string): string {
        return this.translateService[key];
    }

    public hasFocus(): boolean {
        return document.activeElement === this.inputElement.nativeElement;
    }

    private setupComponent(): void {
        this.setupValidators();

        this.setupPropertiesByHtmlType();

        this.setupSubscriptions();
    }

    private setupPropertiesByHtmlType(): void {
        const currentType = this.type();

        const props = {
            shortText: {
                htmlType: "text",
                length: 30
            },
            text: {
                htmlType: "text",
                length: 100
            },
            longText: {
                htmlType: "text",
                length: 150
            },
            extraLongText: {
                htmlType: "text",
                length: 300
            },
            customText: {
                htmlType: "text",
                length: this.maxLength()
            },
            password: {
                htmlType: "password",
                length: 150
            },
            email: {
                htmlType: "text",
                length: 100,
            },
            decimal: {
                htmlType: "text",
                length: 9,
            }
        };

        if (currentType in props) {
            this.inputHtmlType.set(props[currentType]['htmlType']);
            this.maxLengthByHtmlType.set(props[currentType]['length']);
        } else {
            console.warn("Type [" + currentType + "] is not a valid ngt-react-input type!", this.inputElement.nativeElement);
        }
    }

    private setupSubscriptions(): void {
        this.subscriptions.push(
            this.formControl.statusChanges.subscribe(() => {
                this.formControlHasErrors.set(!!this.formControl?.errors);
                this.formControlIsDirty.set(this.formControl?.dirty);
            })
        );

        const unlistenKeydown = this.renderer.listen(this.inputElement.nativeElement, "keydown", (event) => {
            if (this.getNativeValue()?.length >= this.maxLength()) {
                /** Backspace and delete */
                if (event.keyCode != 8 && event.keyCode != 46) {
                    event.preventDefault();

                    return false;
                }
            }
        });

        this.listeners.push(unlistenKeydown);
    }

    private registerEffects(): void {
        effect(() => {
            if (this.focus()) {
                setTimeout(() => this.setFocus());
            }
        });

        effect(() => this.setupMask());

        effect(() => this.setupValidators());

        effect(() => {
            const currentValue = this.currentValue();
            const findResource = this.findExistingResource();

            if (this.ngtResourceService && findResource && currentValue) {
                this.searchExistingResource();
            }
        });

        effect(() => {
            const currentMask = this.mask();
            const shouldValidate = this.allowPhoneValidation();
            const currentValue = this.currentValue();

            if (
                [InputMaskEnum.CELLPHONE, InputMaskEnum.INTERNATIONAL_PHONE].includes(currentMask)
                && shouldValidate
                && currentValue
            ) {
                this.validatePhone();
            }
        });
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const config: NgtReactInputValidationConfig = {
            type: this.type(),
            mask: this.mask(),
            match: this.match(),
            minValue: this.minValue(),
            maxValue: this.maxValue(),
            minLength: this.minLength(),
            maxLength: this.maxLength(),
            isRequired: this.isRequired(),
            validatePassword: this.validatePassword(),
            passwordableId: this.passwordableId(),
            passwordPolicyId: this.passwordPolicyId(),
            uniqueResource: this.uniqueResource(),
            customSyncValidators: this.customSyncValidators(),
            customAsyncValidators: this.customAsyncValidators(),
        };

        const syncValidators = this.validationService.getSyncValidators(config);
        const asyncValidators = this.validationService.getAsyncValidators(config);

        this.formControl.setValidators(syncValidators);
        this.formControl.setAsyncValidators(asyncValidators);
        this.formControl.updateValueAndValidity();
    }

    private setupMask(previousMask?: string): void {
        const currentMask = this.mask();
        const precision = this.decimalMaskPrecision();
        const maxVal = this.maxValue();
        const minVal = this.minValue();

        if (!this.inputElement?.nativeElement) {
            return;
        }

        if (currentMask != previousMask && !currentMask) {
            removeInputMask(this.inputElement.nativeElement);

            return this.clearInput();
        }

        if (!currentMask) {
            return;
        }

        this.maskService.applyMask(
            currentMask,
            this.inputElement.nativeElement,
            this.decimalMaskPrecision(),
            this.maxValue(),
            this.minValue(),
            this.validateMinValueOnMask(),
        );
    }

    private setupNgtStylizable(): void {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtInput', {
            h: 'h-12',
            rounded: 'rounded',
            text: 'text-sm',
            font: 'font-normal',
            color: {
                border: 'border-gray-400 focus:border-gray-700',
                bg: 'bg-bg-white focus:bg-white',
                text: 'text-gray-800'
            }
        });
    }

    private async searchExistingResource(): Promise<void> {
        if (this.searchExistingResourceTimeout) {
            clearTimeout(this.searchExistingResourceTimeout);
        }

        this.searchExistingResourceTimeout = setTimeout(() => {
            this.loaderService.loading.set(true);

            const resource = this.findExistingResource();

            resource.value = this.value;

            this.ngtResourceService.findExisting(resource)
                .then((response: any) => {
                    this.existingResourceId = response.id;
                })
                .catch(() => {
                    this.existingResourceId = null;
                })
                .finally(() => {
                    this.loaderService.loading.set(false);
                    this.changeDetector.markForCheck();
                });
        }, 500);
    }

    private async validatePhone(): Promise<void> {
        if (this.phoneValidatorTimeout) {
            clearTimeout(this.phoneValidatorTimeout);
        }

        this.phoneValidatorTimeout = setTimeout(() => {
            this.loaderService.loading.set(true);

            this.validationService.validatePhone(this.value)
                .then(result => this.validatePhoneResult.emit(result))
                .finally(() => {
                    this.loaderService.loading.set(false);
                    this.changeDetector.markForCheck();
                });
        }, 500);
    }

    private setNativeValue(value: string): void {
        this.inputElement.nativeElement.value = value;
    }

    private getNativeValue(): string {
        return this.inputElement.nativeElement.value;
    }

    private getElementTitle(): string {
        return this.inputElement.nativeElement.parentElement.parentElement.title;
    }

    private hasChangesBetweenModels(): boolean {
        return this.maskService.removeMask(this.getNativeValue()) !== this.value;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private destroyListeners(): void {
        this.listeners.forEach(unlisten => unlisten());
        this.listeners = [];
    }
}
