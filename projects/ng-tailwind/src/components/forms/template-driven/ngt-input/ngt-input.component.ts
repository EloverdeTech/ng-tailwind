import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    Host,
    Injector,
    Input,
    input,
    NgZone,
    OnDestroy,
    Optional,
    output,
    Self,
    Signal,
    signal,
    SkipSelf,
    TemplateRef,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { ControlContainer, NgForm, TouchedChangeEvent, ValueChangeEvent } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { InputMaskEnum } from '../../../../helpers/input-mask/input-mask.helper';
import {
    NgtHttpFindExistingResourceInterface,
    NgtHttpFindExistingResourceResponse,
    NgtHttpResourceService,
} from '../../../../services/http/ngt-http-resource.service';
import { NgtHttpValidationService } from '../../../../services/http/ngt-http-validation.service';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtInputMaskService } from './services/ngt-input-mask.service';
import { NgtInputValidationService, NgtInputValidationConfig } from './services/ngt-input-validation.service';
import { NgtInputLoaderService } from './services/ngt-input-loader.service';

@Component({
    selector: 'ngt-input',
    templateUrl: './ngt-input.component.html',
    styleUrls: ['./ngt-input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtInputComponent),
        NgtInputMaskService,
        NgtInputValidationService,
        NgtInputLoaderService,
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtInputComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild("element", { static: true }) public element: ElementRef;

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
    public readonly decimalMaskPrecision = input<number>(2);
    public readonly showCharactersLength = input<boolean>(false);
    public readonly uppercase = input<boolean>(false);
    public readonly customInnerContentTemplate = input<TemplateRef<any>>();
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly helperAutoXReverse = input<boolean>(true);
    public readonly shining = input<boolean>(false);
    public readonly loading = input<boolean>(false);
    public readonly showRoundedIcon = input<boolean>(false);

    /** Behavior Inputs */

    public readonly type = input<string>('text');
    public readonly name = input<string>();
    // public readonly mask = input<InputMaskEnum | string>();

    @Input() public mask: InputMaskEnum | string;

    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    public readonly focus = input<boolean>(false);
    public readonly allowClear = input<boolean>(false);
    public readonly jit = input<boolean>(false);

    /** Validation Inputs */

    public readonly findExistingResource = input<NgtHttpFindExistingResourceInterface>();
    public readonly allowPhoneValidation = input<boolean>(false);
    public readonly validatePassword = input<boolean>(false);
    public readonly passwordableId = input<string>();
    public readonly passwordPolicyId = input<string>();
    public readonly isRequired = input<boolean>(false);
    public readonly uniqueResource = input<any>();
    public readonly minValue = input<number>();
    public readonly maxValue = input<number>();
    public readonly maxLength = input<number>();
    public readonly minLength = input<number>();
    public readonly match = input<string>();
    public readonly multipleOf = input<number>();
    public readonly validateMinValueOnMask = input<boolean>(false);
    public readonly externalServerDependency = input<boolean>(false);
    public readonly customValidator = input<() => any>();

    /** Outputs */

    public readonly onClickLeftIcon = output<void>();
    public readonly onClickRightIcon = output<void>();
    public readonly validatePhoneResult = output<any>();
    public readonly onValueChange = output<string | number>();

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.loaderService.shining() || this.ngtForm?.isShining()
    );

    public readonly isLoading: Signal<boolean> = computed(
        () => this.loading() || this.loaderService.loading()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => !!(this.ngtForm?.isDisabled() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState())
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent() || this.forceDisable()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly inputPaddingClass: Signal<string> = computed(() =>
        this.getInputPaddingClass()
    );

    public readonly shouldShowClearButton: Signal<boolean> = computed(() =>
        !this.isDisabledState() && this.allowClear() && this.currentValue() && !this.isLoading()
    );

    public readonly shouldShowPasswordIcon: Signal<boolean> = computed(
        () => this.type() === 'password' && this.currentValue()
    );

    public readonly shouldShowRightIcon: Signal<boolean> = computed(
        () => this.innerRightIcon() && this.type() !== 'password'
    );

    public readonly remainingCharacters: Signal<number> = computed(() =>
        this.getRemainingCharacters()
    );

    public readonly inputClasses: Signal<string> = computed(() =>
        this.getInputClasses()
    );

    /** Other */

    public existingResourceId: string;
    public forceDisable: WritableSignal<boolean> = signal(false);

    /** Internal Control */

    public readonly inputHtmlType: WritableSignal<string> = signal('text');
    public readonly componentReady: WritableSignal<boolean> = signal(false);
    public ngtStyle: NgtStylizableService;

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);
    private readonly maxTotalCharsCount: WritableSignal<number> = signal(0);

    private phoneValidatorTimeout: NodeJS.Timeout;
    private searchExistingResourceTimeout: NodeJS.Timeout;

    private inputSubject$ = new Subject<string>();
    private isUserTyping = false;

    private subscriptions: Subscription[] = [];
    private listeners: Array<() => void> = [];

    public constructor(
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtResourceService: NgtHttpResourceService,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional()
        public ngtTranslateService: NgtTranslateService,

        private validationService: NgtInputValidationService,
        private maskService: NgtInputMaskService,
        private loaderService: NgtInputLoaderService,

        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,

        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();

        this.registerEffects();
    }

    public ngAfterViewInit(): void {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!", this.element.nativeElement);
        }

        if (!this.name()) {
            console.error("The element must contain a name attribute!", this.element.nativeElement);
        } else {
            setTimeout(() => {
                this.componentReady.set(true);
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.setupComponent();

                    if (!this.getElementTitle() || this.getElementTitle() === 'null') {
                        this.element.nativeElement.parentElement.parentElement.title = '';
                    }

                    this.cdr.detectChanges();
                });
            }, 500);
        }

        this.cdr.detach();
    }

    public ngOnDestroy(): void {
        this.clearTimeouts();

        this.validationService.clearTimeouts();

        this.destroySubscriptions();

        this.destroyListeners();

        this.inputSubject$.complete();

        this.cdr.reattach();
    }

    public onNativeChange(): void {
        if (this.hasChangesBetweenValues()) {
            const nativeValue = this.getNativeValue();
            const cleanValue = this.maskService.removeMaskFromValue(nativeValue);

            if (this.mask === InputMaskEnum.DECIMAL) {
                this.value = cleanValue.replace(/\./g, '').replace(',', '.');
            } else {
                this.value = cleanValue;
            }
        }
    }

    public change(value: string | number): void {
        if (value && typeof value === 'string' && this.mask === InputMaskEnum.DECIMAL) {
            value = parseFloat(value);
        }

        if (!this.getNativeValue() || this.validateMinValueOnMask()) {
            this.setNativeValue(value ?? '');
        }

        if (!value && value !== 0) {
            this.clearInput();

            return;
        }

        const nativeValue = this.getNativeValue();

        if (this.mask) {
            const ngModelValue = this.maskService.removeMaskFromValue(nativeValue);

            if (nativeValue && ngModelValue !== this.value) {
                this.value = ngModelValue;
            }

            if (
                (this.mask === InputMaskEnum.CELLPHONE || this.mask === InputMaskEnum.INTERNATIONAL_PHONE)
                && this.allowPhoneValidation() && this.value
            ) {
                this.validatePhone();
            }
        } else {
            if (value) {
                this.value = value;
            }

            if (this.value !== nativeValue) {
                this.setNativeValue(value);
            }
        }

        if (this.componentReady()) {
            this.onValueChange.emit(this.value);
        }

        if (this.ngtResourceService && this.findExistingResource() && this.value) {
            this.searchExistingResource();
        }
    }

    public setFocus(): void {
        setTimeout(() => this.element.nativeElement.focus(), 200);
    }

    public setDisabledState(isDisabled: boolean): void {
        this.forceDisable.set(isDisabled);

        this.cdr.detectChanges();
    }

    public clearInput(event?: Event): void {
        event?.stopPropagation();

        this.setNativeValue('');
        this.value = '';

        this.markAsPristine();
    }

    public restorePlaceholder(): void {
        if (this.placeholder() && this.mask) {
            setTimeout(() => this.element.nativeElement.placeholder = this.placeholder());
        }
    }

    public showPassword(): void {
        this.element.nativeElement.type = 'text';
        this.inputHtmlType.set('text');
        this.cdr.detectChanges();
    }

    public hidePassword(): void {
        this.element.nativeElement.type = 'password';
        this.inputHtmlType.set('password');
        this.cdr.detectChanges();
    }

    public hasFocus(): boolean {
        return document.activeElement === this.element.nativeElement;
    }

    private setupComponent(): void {
        if (!this.formContainer || !this.formContainer.control) {
            return;
        }

        this.formControl = this.formContainer.control.get(this.name());

        if (!this.formControl) {
            return;
        }

        this.setupPropertiesByHtmlType();

        this.setupValidators();

        this.setupSubscriptions();

        this.setupListeners();

        if (this.value) {
            this.formControl.markAsDirty();
        } else {
            this.formControl.markAsPristine();
        }

        this.cdr.detectChanges();
    }

    private setupPropertiesByHtmlType(): void {
        const currentType = this.type();

        const props = {
            shortText: { htmlType: "text", length: 30 },
            text: { htmlType: "text", length: 100 },
            longText: { htmlType: "text", length: 150 },
            extraLongText: { htmlType: "text", length: 300 },
            customText: { htmlType: "text", length: this.maxLength() },
            password: { htmlType: "password", length: 150 },
            email: { htmlType: "text", length: 100 },
            decimal: { htmlType: "text", length: 9 }
        };

        if (currentType in props) {
            this.inputHtmlType.set(props[currentType].htmlType);
            this.maxTotalCharsCount.set(props[currentType].length);
        } else {
            this.inputHtmlType.set(currentType);
            this.maxTotalCharsCount.set(this.maxLength() || 100);
        }
    }

    private setupSubscriptions(): void {
        if (this.formControl) {
            this.subscriptions.push(
                this.formControl.events.subscribe((event) => {
                    if (this.isUserTyping) {
                        return;
                    }

                    if (event instanceof TouchedChangeEvent) {
                        this.touched.set(event.touched);
                    }

                    if (event instanceof ValueChangeEvent) {
                        this.onValueChange.emit(event.value);
                    }

                    this.formControlHasErrors.set(!!this.formControl?.errors);
                    this.formControlIsDirty.set(this.formControl?.dirty);

                    if (event instanceof TouchedChangeEvent) {
                        this.cdr.detectChanges();
                    }
                })
            );
        }

        this.subscriptions.push(
            this.inputSubject$.pipe(
                debounceTime(100),
                distinctUntilChanged()
            ).subscribe(value => {
                this.isUserTyping = false;

                if (this.hasChangesBetweenValues()) {
                    const cleanValue = this.maskService.removeMaskFromValue(value);

                    if (this.mask === InputMaskEnum.DECIMAL) {
                        this.value = cleanValue.replace(/\./g, '').replace(',', '.');
                    } else {
                        this.value = cleanValue;
                    }
                }

                this.cdr.detectChanges();
            })
        );
    }

    private setupListeners(): void {
        const inputElement = this.element.nativeElement;

        this.ngZone.runOutsideAngular(() => {
            const inputHandler = (event: Event) => {
                this.isUserTyping = true;

                const value = (event.target as HTMLInputElement).value;

                this.inputSubject$.next(value);
            };

            const keydownHandler = (event: KeyboardEvent) => {
                const currentLength = (event.target as HTMLInputElement).value?.length || 0;
                const maxLen = this.maxTotalCharsCount();

                if (currentLength >= maxLen) {
                    if (event.keyCode !== 8 && event.keyCode !== 46) {
                        event.preventDefault();

                        return false;
                    }
                }
            };

            const blurHandler = () => {
                this.isUserTyping = false;

                this.ngZone.run(() => {
                    this.onTouched();
                    this.restorePlaceholder();
                    this.cdr.detectChanges();
                });
            };

            const focusHandler = () => {
                // Nada - só previne CD padrão
            };

            const mouseleaveHandler = () => {
                this.restorePlaceholder();
            };

            if (this.jit()) {
                inputElement.addEventListener('input', inputHandler, { passive: true });
                this.listeners.push(() => inputElement.removeEventListener('input', inputHandler));
            } else {
                inputElement.addEventListener('change', inputHandler, { passive: true });
                this.listeners.push(() => inputElement.removeEventListener('change', inputHandler));
            }

            inputElement.addEventListener('keydown', keydownHandler);
            inputElement.addEventListener('blur', blurHandler);
            inputElement.addEventListener('focus', focusHandler, { passive: true });
            inputElement.addEventListener('mouseleave', mouseleaveHandler, { passive: true });

            this.listeners.push(
                () => inputElement.removeEventListener('keydown', keydownHandler),
                () => inputElement.removeEventListener('blur', blurHandler),
                () => inputElement.removeEventListener('focus', focusHandler),
                () => inputElement.removeEventListener('mouseleave', mouseleaveHandler)
            );
        });
    }

    private registerEffects(): void {
        effect(() => {
            if (this.focus()) {
                this.setFocus();
            }
        });

        effect(() => {
            this.setupMask();
            this.cdr.detectChanges();
        });

        effect(() => {
            this.setupValidators();
            this.cdr.detectChanges();
        });
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const config: NgtInputValidationConfig = {
            type: this.type(),
            mask: this.mask,
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
            multipleOf: this.multipleOf(),
            externalServerDependency: this.externalServerDependency(),
            customValidator: this.customValidator(),
        };

        const syncValidators = this.validationService.getSyncValidators(config, this.value);
        const asyncValidators = this.validationService.getAsyncValidators(
            config,
            (loading: boolean) => this.loaderService.setLoading(loading),
            this.value
        );

        this.formControl.setValidators(syncValidators);
        this.formControl.setAsyncValidators(asyncValidators);
        this.formControl.updateValueAndValidity();

        if (this.value) {
            this.markAsDirty();
            this.formControlHasErrors.set(!!this.formControl.errors);
            this.formControlIsDirty.set(true);
        }
    }

    private setupMask(): void {
        const currentMask = this.mask;

        if (!this.element?.nativeElement || !currentMask) {
            return;
        }

        this.maskService.applyMask(
            currentMask,
            this.element.nativeElement,
            this.decimalMaskPrecision(),
            this.maxValue(),
            this.minValue(),
            this.validateMinValueOnMask()
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
                bg: 'bg-white focus:bg-white',
                text: 'text-gray-800'
            }
        });
    }

    private async searchExistingResource(): Promise<void> {
        if (this.searchExistingResourceTimeout) {
            clearTimeout(this.searchExistingResourceTimeout);
        }

        this.searchExistingResourceTimeout = setTimeout(() => {
            this.loaderService.setLoading(true);

            const resource = this.findExistingResource();

            resource.value = this.value;

            this.ngtResourceService.findExisting(resource)
                .then((response: NgtHttpFindExistingResourceResponse) => {
                    this.existingResourceId = response.id;
                })
                .catch(() => {
                    this.existingResourceId = null;
                })
                .finally(() => {
                    this.loaderService.setLoading(false);
                    this.cdr.detectChanges();
                });
        }, 500);
    }

    private async validatePhone(): Promise<void> {
        if (this.phoneValidatorTimeout) {
            clearTimeout(this.phoneValidatorTimeout);
        }

        this.phoneValidatorTimeout = setTimeout(() => {
            this.loaderService.setLoading(true);

            const validationService = this.injector.get(NgtHttpValidationService, null);

            if (validationService) {
                validationService.phoneValidation(this.value)
                    .then((response: any) => {
                        this.validatePhoneResult.emit(response);
                    })
                    .finally(() => {
                        this.loaderService.setLoading(false);
                        this.cdr.detectChanges();
                    });
            }
        }, 500);
    }

    private setNativeValue(value: string | number): void {
        this.element.nativeElement.value = value ?? '';
    }

    private getNativeValue(): string {
        return this.element.nativeElement.value;
    }

    private getElementTitle(): string {
        return this.element.nativeElement.parentElement?.parentElement?.title;
    }

    private hasChangesBetweenValues(): boolean {
        const nativeValue = this.getNativeValue();
        const cleanNative = this.maskService.removeMaskFromValue(nativeValue);
        const cleanCurrent = this.maskService.removeMaskFromValue(this.value);

        return cleanNative !== cleanCurrent;
    }

    private getInputPaddingClass(): string {
        let paddingClass = '';

        if (this.innerLeftIcon() || this.customInnerContentTemplate()) {
            paddingClass += 'pl-10 pr-4 ';
        } else {
            paddingClass += 'px-4 ';
        }

        if (this.innerRightIcon() || this.allowClear() || this.type() === 'password') {
            if (this.allowClear() && this.currentValue() && (this.innerRightIcon() || this.type() === 'password')) {
                paddingClass += 'pr-10 ';
            } else {
                paddingClass += 'pr-8 ';
            }
        }

        return paddingClass;
    }

    private getRemainingCharacters(): number {
        if (!this.showCharactersLength() || !this.maxTotalCharsCount()) {
            return null;
        }

        const currentLength = this.currentValue()?.length || 0;
        const maxLength = this.maxTotalCharsCount();
        const remaining = maxLength - currentLength;

        return remaining > 0 ? remaining : 0;
    }

    private getInputClasses(): string {
        const classes: string[] = [
            'flex border appearance-none focus:outline-none leading-tight w-full',
            this.inputPaddingClass(),
            this.ngtStyle.compile(['h', 'text', 'color.border', 'color.bg', 'color.text', 'rounded'])
        ];

        if (this.formControlHasErrors() && (this.formControlIsDirty() || (this.formContainer as any)?.submitted)) {
            classes.push('input-has-error border-red-700');
        }

        return classes.join(' ');
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private destroyListeners(): void {
        this.listeners.forEach(unlisten => unlisten());
        this.listeners = [];
    }

    private clearTimeouts(): void {
        if (this.phoneValidatorTimeout) {
            clearTimeout(this.phoneValidatorTimeout);
        }

        if (this.searchExistingResourceTimeout) {
            clearTimeout(this.searchExistingResourceTimeout);
        }
    }
}
