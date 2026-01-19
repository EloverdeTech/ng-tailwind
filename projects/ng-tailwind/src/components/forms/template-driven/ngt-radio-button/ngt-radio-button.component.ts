import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    EffectRef,
    ElementRef,
    Host,
    Injector,
    input,
    OnDestroy,
    Optional,
    OutputRefSubscription,
    Self,
    Signal,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtRadioButtonContainerComponent } from './ngt-radio-button-container/ngt-radio-button-container.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';

@Component({
    selector: 'ngt-radio-button',
    templateUrl: './ngt-radio-button.component.html',
    styleUrls: ['./ngt-radio-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtRadioButtonComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtRadioButtonComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('radioBtnElement', { static: true }) public element: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly name = input<string>();
    public readonly shining = input<boolean>(false);
    public readonly selectedHexColor = input<string>();

    public readonly helpTitle = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly helpText = input<string>();
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly helperAutoXReverse = input<boolean>(true);

    /** Behavior Inputs */

    public readonly isSelectable = input<boolean>(true);
    public readonly isDisabled = input<boolean>(false);

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

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly labelClasses: Signal<string> = computed(() =>
        this.getLabelClasses()
    );

    public readonly radioStyle: Signal<string> = computed(() =>
        this.getRadioStyle()
    );

    public readonly radioClasses: Signal<string> = computed(() =>
        this.getRadioClasses()
    );

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription | OutputRefSubscription> = [];
    private nativeValueEffect?: EffectRef;

    public constructor(
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional() @SkipSelf()
        private ngtRadioButtonContainer: NgtRadioButtonContainerComponent,

        protected override injector: Injector,

        @Optional() @Host()
        public formContainer: ControlContainer
    ) {
        super();

        this.setupNgtStylizable();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupSubscriptions();
        this.setupNativeValueEffect();
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
        this.nativeValueEffect?.destroy();
    }

    public onNativeChange(): void {
        const value: boolean = this.getNativeValue();

        if (this.value !== value) {
            this.value = value;
        }

        if (value && this.ngtRadioButtonContainer) {
            this.ngtRadioButtonContainer.setActiveRadioButton(this);
        }
    }

    public change(value: boolean): void {
        if (this.getNativeValue() !== value) {
            this.setNativeValue(value);
        }

        if (value && this.ngtRadioButtonContainer) {
            this.ngtRadioButtonContainer.setActiveRadioButton(this);
        }
    }

    private setupSubscriptions(): void {
        if (this.ngtRadioButtonContainer) {
            this.subscriptions.push(
                this.ngtRadioButtonContainer.onActiveRadioButtonChange.subscribe((activeRadioButton: NgtRadioButtonComponent) => {
                    const isActive = activeRadioButton.name() === this.name();

                    if (this.value !== isActive) {
                        this.value = isActive;
                    }
                })
            );
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtRadioButton', {
            color: {
                text: 'text-gray-500',
                border: 'border-gray-500',
            }
        });
    }

    private setupNativeValueEffect(): void {
        this.nativeValueEffect = effect(() => {
            this.setNativeValue(!!this.currentValue());
        });
    }

    private setNativeValue(value: boolean): void {
        this.element.nativeElement.checked = value;
    }

    private getNativeValue(): boolean {
        return this.element.nativeElement.checked;
    }

    private getLabelClasses(): string {
        const classes: string[] = ['inline-flex items-center'];

        if (this.isDisabledState() || !this.isSelectable()) {
            classes.push('cursor-not-allowed opacity-50');
        } else {
            classes.push('cursor-pointer');
        }

        return classes.join(' ');
    }

    private getRadioStyle(): string {
        let baseStyle = 'width: 20px; height: 20px;';

        if (this.selectedHexColor()) {
            baseStyle += ` color: ${this.selectedHexColor()}`;
        }

        return baseStyle;
    }

    private getRadioClasses(): string {
        const classes: string[] = [
            'shadow rounded-full border text-sm'
        ];

        if (!this.isShining()) {
            classes.push('flex justify-center items-center');
        } else {
            classes.push('hidden');
        }

        if (this.currentValue()) {
            classes.push(this.ngtStyle.compile(['color.border', 'color.text']));
        } else {
            classes.push('border-gray-500');
        }

        return classes.join(' ');
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
