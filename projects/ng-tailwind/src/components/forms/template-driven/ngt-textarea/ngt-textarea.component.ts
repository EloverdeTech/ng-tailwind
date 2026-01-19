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
    input,
    NgZone,
    OnDestroy,
    Optional,
    output,
    Self,
    signal,
    Signal,
    SkipSelf,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

@Component({
    selector: 'ngt-textarea',
    templateUrl: './ngt-textarea.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtTextareaComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtTextareaComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('element', { static: true }) public element: ElementRef<HTMLTextAreaElement>;

    /** Visual Inputs */

    public readonly label = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly rows = input<string>('3');
    public readonly showCharactersLength = input<boolean>(false);
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly shining = input<boolean>(false);

    /** Behavior Inputs */

    public readonly name = input<string>();
    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    public readonly jit = input<boolean>(false);
    public readonly focus = input<boolean>(false);

    /** Validation Inputs */

    public readonly isRequired = input<boolean>(false);
    public readonly maxLength = input<number>(300);

    /** Outputs */

    public readonly onValueChange = output<string>();

    /** Signals */

    public readonly componentReady: WritableSignal<boolean> = signal(false);

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtForm?.isShining()
    );

    public readonly currentValue: Signal<string> = computed(() => this.value ?? '');

    public readonly remainingCharacters: Signal<number> = computed(() =>
        this.getRemainingCharacters()
    );

    public readonly textareaClasses: Signal<string> = computed(() =>
        this.getTextareaClasses()
    );

    /** Internal State */

    public ngtStyle: NgtStylizableService;

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);
    private readonly isFormSubmitted: WritableSignal<boolean> = signal(false);
    private readonly formControlReady: WritableSignal<boolean> = signal(false);

    private readonly inputSubject$ = new Subject<string>();
    private subscriptions: Array<Subscription | { unsubscribe: () => void }> = [];
    private listeners: Array<() => void> = [];

    public constructor(
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,

        protected override injector: Injector,

        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        super();

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtTextarea', {
            text: 'text-sm',
            font: 'font-normal',
            color: {
                border: 'border-gray-400 focus:border-gray-700',
                bg: 'bg-bg-white focus:bg-white',
                text: 'text-gray-800'
            }
        });

        this.registerEffects();

        console.log('NgtTextareaComponent constructed');
    }

    public ngAfterViewInit(): void {
        if (!this.formContainer) {
            console.warn("The element must be inside a <form #form='ngForm'> tag!", this.element.nativeElement);
        }

        if (!this.name()) {
            console.warn("The element must contain a name attribute!", this.element.nativeElement);

            return;
        }

        setTimeout(() => {
            this.componentReady.set(true);

            this.initComponent();

            this.cdr.detach();

            this.requestChangeDetection();
        });
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
        this.destroyListeners();
        this.inputSubject$.complete();
        this.cdr.reattach();
    }

    public setFocus(): void {
        setTimeout(() => this.element.nativeElement.focus(), 200);
    }

    public clear(): void {
        this.setNativeValue('');
        this.value = '';
    }

    public override change(value: string): void {
        if (this.componentReady()) {
            this.onValueChange.emit(value);
        }

        if (this.getNativeValue() != value) {
            this.setNativeValue(value ?? '');
        }

        this.updateFormStateSignals();
        this.requestChangeDetection();
    }

    public getRemainingCharacters(): number {
        if (!this.showCharactersLength()) {
            return null;
        }

        const maxLength = this.maxLength();

        if (!maxLength) {
            return null;
        }

        const currentLength = this.currentValue()?.length || 0;
        const remaining = maxLength - currentLength;

        return remaining > 0 ? remaining : 0;
    }

    private initComponent(): void {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name()))) {
            this.formControlReady.set(true);

            if (this.focus()) {
                this.setFocus();
            }

            this.setupOptimizedListeners();
            this.setupFormSubmissionListener();
            this.setupValidators();
            this.updateFormStateSignals();

            if (this.value) {
                this.formControl.markAsDirty();
            } else {
                this.formControl.markAsPristine();
            }
        } else {
            console.warn("The element must contain a ngModel property", this.element.nativeElement);
        }
    }

    private setupOptimizedListeners(): void {
        const textarea = this.element.nativeElement;

        this.ngZone.runOutsideAngular(() => {
            const changeHandler = () => {
                const value = textarea.value ?? '';

                if (this.hasChangesBetweenValues(value)) {
                    this.value = value;
                }
            };

            const inputHandler = (event: Event) => {
                if (!this.jit()) {
                    return;
                }

                const value = (event.target as HTMLTextAreaElement).value;

                this.inputSubject$.next(value);
            };

            const keydownHandler = (event: KeyboardEvent) => {
                const currentLength = (event.target as HTMLTextAreaElement).value?.length || 0;
                const maxLength = this.maxLength();

                if (maxLength && currentLength >= maxLength) {
                    if (event.keyCode !== 8 && event.keyCode !== 46) {
                        event.preventDefault();

                        return false;
                    }
                }
            };

            const blurHandler = () => {
                this.ngZone.run(() => {
                    this.onTouched();
                    this.requestChangeDetection();
                });
            };

            const focusHandler = () => {
                //
            };

            textarea.addEventListener('change', changeHandler, { passive: true });
            textarea.addEventListener('input', inputHandler, { passive: true });
            textarea.addEventListener('keydown', keydownHandler);
            textarea.addEventListener('blur', blurHandler);
            textarea.addEventListener('focus', focusHandler, { passive: true });

            this.listeners.push(
                () => textarea.removeEventListener('change', changeHandler),
                () => textarea.removeEventListener('input', inputHandler),
                () => textarea.removeEventListener('keydown', keydownHandler),
                () => textarea.removeEventListener('blur', blurHandler),
                () => textarea.removeEventListener('focus', focusHandler)
            );
        });

        this.subscriptions.push(
            this.inputSubject$.pipe(
                debounceTime(100),
                distinctUntilChanged()
            ).subscribe(value => {
                if (!this.jit()) {
                    return;
                }

                if (this.hasChangesBetweenValues(value)) {
                    this.value = value;
                }

                this.requestChangeDetection();
            })
        );
    }

    private setupFormSubmissionListener(): void {
        const ngForm = this.formContainer as NgForm;

        if (ngForm?.ngSubmit) {
            this.subscriptions.push(
                ngForm.ngSubmit.subscribe(() => {
                    this.isFormSubmitted.set(true);
                    this.requestChangeDetection();
                })
            );
        }
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const syncValidators = [];

        if (this.isRequired()) {
            syncValidators.push(Validators.required);
        }

        if (this.maxLength()) {
            syncValidators.push(Validators.maxLength(this.maxLength()));
        }

        this.formControl.setValidators(syncValidators);
        this.formControl.updateValueAndValidity();

        this.updateFormStateSignals();
    }

    private getNativeValue(): string {
        return this.element.nativeElement.value;
    }

    private setNativeValue(value: string): void {
        this.element.nativeElement.value = value;
    }

    private hasChangesBetweenValues(nextValue: string): boolean {
        return nextValue != this.value;
    }

    private updateFormStateSignals(): void {
        if (!this.formControl) {
            return;
        }

        this.formControlHasErrors.set(!!this.formControl.errors);
        this.formControlIsDirty.set(!!this.formControl.dirty);
    }

    private getTextareaClasses(): string {
        const classes: string[] = [
            'appearance-none block border focus:outline-none leading-tight text-xs px-3 py-3 rounded w-full',
            this.ngtStyle.compile(['h', 'color.border', 'color.bg', 'color.text'])
        ];

        if (this.formControlHasErrors() && (this.formControlIsDirty() || this.isFormSubmitted())) {
            classes.push('textarea-has-error border-red-700');
        }

        return classes.join(' ');
    }

    private registerEffects(): void {
        effect(() => {
            if (this.focus()) {
                this.setFocus();
            }
        });

        effect(() => {
            if (!this.formControlReady()) {
                return;
            }

            this.setupValidators();
            this.requestChangeDetection();
        });

        effect(() => {
            this.label();
            this.placeholder();
            this.rows();
            this.showCharactersLength();
            this.helpTitle();
            this.helpText();
            this.helpTextColor();
            this.isShining();
            this.isDisabled();
            this.isReadonly();
            this.componentReady();

            this.requestChangeDetection();
        });
    }

    private requestChangeDetection(): void {
        if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
        }
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
