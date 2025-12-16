import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    Injector,
    input,
    Optional,
    output,
    Self,
    Signal,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

export enum NgtReactiveCheckboxMode {
    DEFAULT = 'DEFAULT',
    TOGGLE = 'TOGGLE',
    SIDE_TOGGLE = 'SIDE_TOGGLE',
    RADIO = 'RADIO'
}

@Component({
    selector: 'ngt-reactive-checkbox',
    templateUrl: './ngt-reactive-checkbox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveCheckboxComponent)
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtShiningModule,
        NgtHelperComponent,
    ],
    animations: [
        trigger('slideLeftToRight', [
            state('void', style({ transform: 'translateX(-4px) rotate(45deg)', opacity: 0 })),
            transition(':enter', [
                animate(200)
            ])
        ]),
        trigger('slideRightToLeft', [
            state('void', style({ transform: 'translateX(4px) rotate(45deg)', opacity: 0 })),
            transition(':enter', [
                animate(200)
            ])
        ])
    ],
})
export class NgtReactiveCheckboxComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('checkboxElement', { static: true }) public checkboxElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly helpTitle = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly helpText = input<string>();
    public readonly helperAutoXReverse = input<boolean>(true);
    public readonly shining = input<boolean>(false);

    /** Behavior Inputs */

    public readonly mode = input<NgtReactiveCheckboxMode>(NgtReactiveCheckboxMode.DEFAULT);
    public readonly isDisabled = input<boolean>(false);
    public readonly isClickDisabled = input<boolean>(false);

    /** Outputs */

    public readonly onValueChange = output<boolean>();

    /** Computed Signals */

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtForm?.shining()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly isToggleMode: Signal<boolean> = computed(
        () => this.mode() == NgtReactiveCheckboxMode.TOGGLE
    );

    public readonly isSideToggleMode: Signal<boolean> = computed(
        () => this.mode() == NgtReactiveCheckboxMode.SIDE_TOGGLE
    );

    public readonly isDefaultMode: Signal<boolean> = computed(
        () => this.mode() == NgtReactiveCheckboxMode.DEFAULT
    );

    public readonly isRadioMode: Signal<boolean> = computed(
        () => this.mode() == NgtReactiveCheckboxMode.RADIO
    );

    /** Other */

    public ngtStyle: NgtStylizableService;

    public constructor(
        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();
    }

    public change(value: boolean): void {
        this.onValueChange.emit(value);

        if (this.hasChangeBetweenValues()) {
            this.setNativeValue(value);
        }
    }

    public onNativeChange(): void {
        if (this.hasChangeBetweenValues()) {
            this.value = this.getNativeValue();

            this.formControl?.setValue(this.value);
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtCheckbox', {
            h: 'h-6',
            w: 'w-6',
            text: 'text-sm',
            fontCase: '',
            color: {
                bg: 'bg-gray-500',
                text: 'text-gray-500',
                border: 'border-gray-500',
            }
        });
    }

    private setNativeValue(value: boolean): void {
        this.checkboxElement.nativeElement.checked = value;
    }

    private getNativeValue(): boolean {
        return this.checkboxElement.nativeElement.checked;
    }

    private hasChangeBetweenValues(): boolean {
        return this.getNativeValue() !== this.value;
    }
}
