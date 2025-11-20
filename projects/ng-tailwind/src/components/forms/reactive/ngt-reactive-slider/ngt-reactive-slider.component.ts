import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    Injector,
    input,
    Optional,
    Signal,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';

export enum NgtReactiveSliderColorSchemeEnum {
    PRIMARY = 'primary',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger'
}

@Component({
    selector: 'ngt-reactive-slider',
    templateUrl: './ngt-reactive-slider.component.html',
    styleUrls: ['./ngt-reactive-slider.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveSliderComponent),
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtShiningModule,
    ],
})
export class NgtReactiveSliderComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('sliderElement', { static: true }) public sliderElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly shining = input<boolean>(false);
    public readonly showPercentageSymbol = input<boolean>(false);
    public readonly colorByValue = input<(value: number) => NgtReactiveSliderColorSchemeEnum>(() => NgtReactiveSliderColorSchemeEnum.PRIMARY);

    /** Behavior Inputs */

    public readonly isDisabled = input<boolean>(false);
    public readonly min = input<number>(0);
    public readonly max = input<number>(100);
    public readonly step = input<number>(1);

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

    public constructor(
        @Optional() @SkipSelf()
        private ngtForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        protected override injector: Injector,
    ) {
        super();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();
    }

    public onNativeChange(): void {
        if (this.hasChangesBetweenValues()) {
            this.value = parseFloat(this.getNativeValue());
        }
    }

    public change(value: number): void {
        if (this.hasChangesBetweenValues()) {
            this.formControl?.setValue(value ?? this.min());

            this.setNativeValue(value ?? this.min());
        }
    }

    private setNativeValue(value: number): void {
        this.sliderElement.nativeElement.value = value;
    }

    private getNativeValue(): string {
        return this.sliderElement.nativeElement.value;
    }

    private getSliderClasses(): string {
        const classes: string[] = [
            'block w-full cursor-pointer overflow-hidden appearance-none bg-gray-400 rounded',
            this.colorByValue()(this.value),
        ];

        if (this.isDisabledState()) {
            classes.push('cursor-not-allowed opacity-50');
        }

        return classes.join(' ');
    }

    private hasChangesBetweenValues(): boolean {
        return this.getNativeValue() !== this.value;
    }
}
