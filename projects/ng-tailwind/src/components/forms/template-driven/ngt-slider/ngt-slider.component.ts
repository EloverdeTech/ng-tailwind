import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    Host,
    Injector,
    input,
    Optional,
    Signal,
    signal,
    SkipSelf,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';

export enum NgtSliderColorSchemeEnum {
    PRIMARY = 'primary',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger'
};

@Component({
    selector: 'ngt-slider',
    templateUrl: './ngt-slider.component.html',
    styleUrls: ['./ngt-slider.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtSliderComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtSliderComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('sliderElement', { static: true }) public sliderElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly shining = input<boolean>(false);
    public readonly showPercentageSymbol = input<boolean>(false);
    public readonly color = input<NgtSliderColorSchemeEnum>(NgtSliderColorSchemeEnum.PRIMARY);

    /** Behavior Inputs */

    public readonly isDisabled = input<boolean>(false);
    public readonly name = input<string>();
    public readonly min = input<string>('0');
    public readonly max = input<string>('100');
    public readonly step = input<string>('1');

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

    public readonly sliderClasses: Signal<string> = computed(() => this.getSliderClasses());

    public readonly minValue: Signal<number> = computed(() => this.coerceNumber(this.min(), 0));
    public readonly maxValue: Signal<number> = computed(() => this.coerceNumber(this.max(), 100));
    public readonly stepValue: Signal<number> = computed(() => this.coerceNumber(this.step(), 1));

    public readonly displayValue: Signal<number> = computed(
        () => this.value ?? this.minValue()
    );

    /** Internal Signals */

    private readonly viewReady: WritableSignal<boolean> = signal(false);

    public constructor(
        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        protected override injector: Injector,
    ) {
        super();

        effect(() => {
            if (!this.viewReady()) {
                return;
            }

            this.setNativeValue(this.displayValue());
        }, { injector: this.injector });
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();
        this.viewReady.set(true);
    }

    public onNativeChange(): void {
        if (this.hasChangesBetweenValues()) {
            this.value = this.getNativeValue();
        }
    }

    public change(value: number): void {
        if (this.hasChangesBetweenValues()) {
            this.setNativeValue(value ?? this.minValue());
        }
    }

    private setNativeValue(value: number): void {
        this.sliderElement.nativeElement.value = value;
    }

    private getNativeValue(): number {
        const value = parseFloat(this.sliderElement.nativeElement.value);

        return Number.isNaN(value) ? this.minValue() : value;
    }

    private getSliderClasses(): string {
        const classes: string[] = [
            'block w-full cursor-pointer overflow-hidden appearance-none bg-gray-400 rounded',
            this.color(),
        ];

        if (this.isDisabledState()) {
            classes.push('cursor-not-allowed opacity-50');
        }

        return classes.join(' ');
    }

    private hasChangesBetweenValues(): boolean {
        return this.getNativeValue() !== this.value;
    }

    private coerceNumber(value: string, fallback: number): number {
        const parsed = parseFloat(value);

        return Number.isNaN(parsed) ? fallback : parsed;
    }
}
