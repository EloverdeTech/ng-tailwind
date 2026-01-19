import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    Host,
    Injector,
    input,
    Optional,
    Self,
    Signal,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';

export enum NgtCheckboxMode {
    DEFAULT = 'DEFAULT',
    TOGGLE = 'TOGGLE',
    SIDE_TOGGLE = 'SIDE_TOGGLE',
    RADIO = 'RADIO'
}

@Component({
    selector: 'ngt-checkbox',
    templateUrl: './ngt-checkbox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtCheckboxComponent)
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
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
    standalone: false
})
export class NgtCheckboxComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('checkboxElement', { static: true }) public checkboxElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly helpTitle = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly helpText = input<string>();
    public readonly helperAutoXReverse = input<boolean>(true);
    public readonly shining = input<boolean>(false);

    /** Behavior Inputs */

    public readonly mode = input<NgtCheckboxMode>(NgtCheckboxMode.DEFAULT);
    public readonly isDisabled = input<boolean>(false);
    public readonly isClickDisabled = input<boolean>(false);
    public readonly name = input<string>();

    /** Computed Signals */

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent() || this.isClickDisabled()
    );

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtForm?.shining()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly isToggleMode: Signal<boolean> = computed(
        () => this.mode() == NgtCheckboxMode.TOGGLE
    );

    public readonly isSideToggleMode: Signal<boolean> = computed(
        () => this.mode() == NgtCheckboxMode.SIDE_TOGGLE
    );

    public readonly isDefaultMode: Signal<boolean> = computed(
        () => this.mode() == NgtCheckboxMode.DEFAULT
    );

    public readonly isRadioMode: Signal<boolean> = computed(
        () => this.mode() == NgtCheckboxMode.RADIO
    );

    /** Other */

    public ngtStyle: NgtStylizableService;

    public constructor(
        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

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
        if (this.hasChangeBetweenValues()) {
            this.setNativeValue(value);
        }
    }

    public onNativeChange(): void {
        if (this.hasChangeBetweenValues()) {
            this.value = this.getNativeValue();
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
