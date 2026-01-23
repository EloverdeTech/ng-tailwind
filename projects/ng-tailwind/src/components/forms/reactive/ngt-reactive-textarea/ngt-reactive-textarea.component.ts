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
    NgZone,
    OnDestroy,
    Optional,
    output,
    Self,
    Signal,
    signal,
    SkipSelf,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncValidatorFn, ReactiveFormsModule, TouchedChangeEvent, ValidatorFn, ValueChangeEvent } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtReactiveTextareaValidationService, NgtReactiveTextareaValidationConfig } from './services/ngt-reactive-textarea-validation.service';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

@Component({
    selector: 'ngt-reactive-textarea',
    templateUrl: './ngt-reactive-textarea.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveTextareaComponent),
        NgtReactiveTextareaValidationService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtShiningModule,
        NgtValidationModule,
        NgtHelperComponent,
    ],
})
export class NgtReactiveTextareaComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('textareaElement', { static: true }) public textareaElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly placeholder = input<string>('');
    public readonly rows = input<string>('3');
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly showCharactersLength = input<boolean>(false);
    public readonly shining = input<boolean>(false);

    /** Behavior Inputs */

    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    public readonly focus = input<boolean>(false);

    /** Validation Inputs */

    public readonly isRequired = input<boolean>(false);
    public readonly maxLength = input<number>(300);
    public readonly minLength = input<number>();
    public readonly customSyncValidators = input<ValidatorFn[]>();
    public readonly customAsyncValidators = input<AsyncValidatorFn[]>();

    /** Outputs */

    public readonly onValueChange = output<string>();

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtReactiveForm?.shining()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtReactiveForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly currentValue: Signal<string> = computed(() => this.value);

    public readonly remainingCharacters: Signal<number> = computed(() =>
        this.getRemainingCharacters()
    );

    public readonly textareaClasses: Signal<string> = computed(() =>
        this.getTextareaClasses()
    );

    /** Internal Control */

    public ngtStyle: NgtStylizableService;

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);

    private inputSubject$ = new Subject<string>();
    private isUserTyping = false;

    private subscriptions: Subscription[] = [];
    private listeners: Array<() => void> = [];

    public constructor(
        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtReactiveForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional()
        private translateService: NgtTranslateService,

        private validationService: NgtReactiveTextareaValidationService,
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone,

        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();

        this.registerEffects();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupComponent();

        this.changeDetector.detach();
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();

        this.destroyListeners();

        this.inputSubject$.complete();

        this.changeDetector.reattach();
    }

    public onNativeChange(): void {
        if (this.hasChangesBetweenValues()) {
            this.value = this.getNativeValue();
        }
    }

    public change(value: string): void {
        if (this.value != this.getNativeValue()) {
            this.setNativeValue(value ?? '');
        }
    }

    public setFocus(): void {
        this.textareaElement.nativeElement.focus();
    }

    public clear(): void {
        this.setNativeValue('');
        this.value = '';
    }

    public getTranslation(key: string): string {
        return this.translateService?.[key];
    }

    private setupComponent(): void {
        this.setupValidators();

        this.setupSubscriptions();

        this.setupListeners();
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
                        this.changeDetector.detectChanges();
                    }
                })
            );
        }

        this.subscriptions.push(
            this.inputSubject$
                .pipe(
                    debounceTime(100),
                    distinctUntilChanged()
                )
                .subscribe(value => {
                    this.isUserTyping = false;

                    if (this.hasChangesBetweenValues()) {
                        this.value = value;
                    }

                    this.changeDetector.detectChanges();
                })
        );
    }

    private setupListeners(): void {
        const textarea = this.textareaElement.nativeElement;

        this.ngZone.runOutsideAngular(() => {
            const inputHandler = (event: Event) => {
                this.isUserTyping = true;

                const value = (event.target as HTMLTextAreaElement).value;

                this.inputSubject$.next(value);
            };

            const keydownHandler = (event: KeyboardEvent) => {
                const currentLength = (event.target as HTMLTextAreaElement).value?.length || 0;

                if (currentLength >= this.maxLength()) {
                    if (event.key !== 'Backspace' && event.key !== 'Delete') {
                        event.preventDefault();

                        return false;
                    }
                }
            };

            const blurHandler = () => {
                this.isUserTyping = false;

                this.ngZone.run(() => {
                    this.onTouched();
                    this.changeDetector.detectChanges();
                });
            };

            const focusHandler = () => {
                // Prevent default CD
            };

            textarea.addEventListener('input', inputHandler, { passive: true });
            textarea.addEventListener('keydown', keydownHandler);
            textarea.addEventListener('blur', blurHandler);
            textarea.addEventListener('focus', focusHandler, { passive: true });

            this.listeners.push(
                () => textarea.removeEventListener('input', inputHandler),
                () => textarea.removeEventListener('keydown', keydownHandler),
                () => textarea.removeEventListener('blur', blurHandler),
                () => textarea.removeEventListener('focus', focusHandler)
            );
        });

        this.changeDetector.detectChanges();
    }

    private registerEffects(): void {
        effect(() => {
            if (this.focus()) {
                setTimeout(() => this.setFocus());
            }
        });

        effect(() => {
            this.setupValidators();

            this.changeDetector.detectChanges();
        });
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const config: NgtReactiveTextareaValidationConfig = {
            isRequired: this.isRequired(),
            minLength: this.minLength(),
            maxLength: this.maxLength(),
            customSyncValidators: this.customSyncValidators(),
            customAsyncValidators: this.customAsyncValidators(),
        };

        const syncValidators = this.validationService.getSyncValidators(config);
        const asyncValidators = this.validationService.getAsyncValidators(config);

        this.formControl.setValidators(syncValidators);
        this.formControl.setAsyncValidators(asyncValidators);
        this.formControl.updateValueAndValidity();

        if (this.value) {
            this.markAsDirty();

            this.formControlHasErrors.set(!!this.formControl.errors);
            this.formControlIsDirty.set(true);
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtTextarea', {
            text: 'text-sm',
            font: 'font-normal',
            color: {
                border: 'border-gray-400 focus:border-gray-700',
                bg: 'bg-white focus:bg-white',
                text: 'text-gray-800'
            },
            rounded: 'rounded'
        });
    }

    private setNativeValue(value: string): void {
        this.textareaElement.nativeElement.value = value;
    }

    private getNativeValue(): string {
        return this.textareaElement.nativeElement.value;
    }

    private hasChangesBetweenValues(): boolean {
        return this.getNativeValue() != this.value;
    }

    private getRemainingCharacters(): number {
        if (!this.showCharactersLength() || !this.maxLength()) {
            return null;
        }

        const currentLength = this.currentValue()?.length || 0;
        const remaining = this.maxLength() - currentLength;

        return remaining > 0 ? remaining : 0;
    }

    private getTextareaClasses(): string {
        const classes: string[] = [
            'flex border appearance-none focus:outline-none leading-tight w-full px-4 py-3',
            this.ngtStyle.compile(['text', 'color.border', 'color.bg', 'color.text', 'rounded'])
        ];

        if (this.formControlHasErrors() && (this.formControlIsDirty() || this.touched())) {
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
}
