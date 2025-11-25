import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
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
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtReactiveRadioButtonContainerComponent } from './ngt-reactive-radio-button-container/ngt-reactive-radio-button-container.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../../../ngt-svg/ngt-svg.module';
import { uuid } from '../../../../helpers/uuid';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

@Component({
    selector: 'ngt-reactive-radio-button',
    templateUrl: './ngt-reactive-radio-button.component.html',
    styleUrls: ['./ngt-reactive-radio-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveRadioButtonComponent),
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtShiningModule,
        NgtSvgModule,
        NgtHelperComponent,
    ],
})
export class NgtReactiveRadioButtonComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('radioBtnElement', { static: true }) public radioBtnElement: ElementRef;

    /** Visual Inputs */

    public readonly label = input<string>();
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

    public readonly canInteract: Signal<boolean> = computed(
        () => !this.isDisabledState() && this.isSelectable()
    );

    public readonly labelClasses: Signal<string> = computed(() =>
        this.getLabelClasses()
    );

    public readonly radioStyle: Signal<string> = computed(() =>
        this.getRadioStyle()
    );

    public readonly radioClasses: Signal<string> = computed(() =>
        this.getRadioClasses()
    );

    /** Internal Control */

    public ngtStyle: NgtStylizableService;

    public uuid: string = uuid();

    private subscriptions: Array<Subscription | OutputRefSubscription> = [];

    public constructor(
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional() @SkipSelf()
        private container: NgtReactiveRadioButtonContainerComponent,

        protected override injector: Injector,
    ) {
        super();

        this.setupNgtStylizable();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupSubscriptions();
    }

    public ngOnDestroy(): void {
        this.destroySubscritpions();
    }

    public onNativeChange(): void {
        const value: boolean = this.getNativeValue();

        if (this.value !== value) {
            this.value = value;
        }

        if (this.formControl?.value !== value) {
            this.formControl?.setValue(value);
        }

        if (value && this.container) {
            this.container.setActiveRadioButton(this);
        }
    }

    public change(value: boolean): void {
        if (this.getNativeValue() !== value) {
            this.setNativeValue(value);
        }
    }

    private setupSubscriptions(): void {
        if (this.container) {
            const onActiveRadioButtonChange = this.container.onActiveRadioButtonChange
                .subscribe((activeRadioButton: NgtReactiveRadioButtonComponent) => {
                    const isActive = activeRadioButton.uuid === this.uuid;

                    if (!isActive && this.value) {
                        this.value = false;
                        this.formControl?.setValue(false);
                    }
                });

            this.subscriptions.push(onActiveRadioButtonChange);
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

    private setNativeValue(value: boolean): void {
        this.radioBtnElement.nativeElement.checked = value;
    }

    private getNativeValue(): boolean {
        return this.radioBtnElement.nativeElement.checked;
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

    private destroySubscritpions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
