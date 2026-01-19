import {
    ChangeDetectionStrategy,
    Component,
    Signal,
    computed,
    effect,
    Injector,
    input,
    Optional,
    Self,
    SkipSelf,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../forms/template-driven/ngt-form/ngt-form.component';
import { NgtReactiveFormComponent } from '../forms/reactive/ngt-reactive-form/ngt-reactive-form.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';

@Component({
    selector: 'ngt-button',
    templateUrl: './ngt-button.component.html',
    styleUrls: ['./ngt-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtButtonComponent {
    /** Inputs */

    public readonly href = input<string>();
    public readonly type = input<string>('success');
    public readonly link = input<boolean>(false);
    public readonly loading = input<boolean>(false);
    public readonly isDisabled = input<boolean>(false);
    public readonly forceEnable = input<boolean>(false);
    public readonly noSubmit = input<boolean>(false);

    /** Computed Signals */

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabled()
            || this.ngtReactiveForm?.isDisabledState()
            || this.ngtSection?.isDisabledState()
            || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => !this.forceEnable() && (this.isDisabled() || this.isDisabledByParent())
    );

    public readonly loadingState: Signal<boolean> = computed(
        () => this.loading()
            || this.ngtReactiveForm?.loading()
            || this.ngtForm?.loading()
    );

    public readonly buttonType: Signal<'button' | 'submit'> = computed(
        () => (this.loadingState() || this.isDisabledState() || this.noSubmit()) ? 'button' : 'submit'
    );

    public readonly containerClass: Signal<string> = computed(
        () => `flex justify-center items-center focus:outline-none cursor-pointer ${this.ngtStyle.compile(['color.bg', 'color.text', 'color.border', 'px', 'py', 'border', 'text', 'font', 'w', 'h', 'rounded'])}`
    );

    public readonly wrapperClass: Signal<string> = computed(
        () => `relative ${this.ngtStyle.compile(['w', 'h'])}`
    );

    public readonly stateClasses: Signal<Record<string, boolean>> = computed(
        () => ({
            'disabled-button': this.isDisabledState(),
            'loading-button': this.loadingState(),
        })
    );

    /** Other */

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtReactiveForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();

        effect(() => {
            this.applyTypeStyle(this.type());
        });
    }

    public onClick(event: Event): void {
        if (this.isDisabledState() || this.loadingState()) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtButton', {
            px: 'px-2',
            py: 'py-1',
            text: 'text-xs',
            font: 'font-normal',
            w: 'w-full',
            h: 'h-full',
            rounded: 'rounded'
        });
    }

    private applyTypeStyle(type: string): void {
        if (type === 'success') {
            this.ngtStyle.load(this.injector, 'NgtSuccessButton', {
                color: {
                    bg: 'bg-green-500',
                    text: 'text-white text-xs',
                }
            });

            return;
        }

        if (type === 'warning') {
            this.ngtStyle.load(this.injector, 'NgtWarningButton', {
                color: {
                    bg: 'bg-orange-500',
                    text: 'text-white text-xs',
                }
            });

            return;
        }

        if (type === 'danger') {
            this.ngtStyle.load(this.injector, 'NgtDangerButton', {
                color: {
                    bg: 'bg-red-500',
                    text: 'text-white text-xs',
                }
            });

            return;
        }

        this.ngtStyle.load(this.injector, 'NgtInfoButton', {
            color: {
                bg: 'bg-blue-500',
                text: 'text-white text-xs',
            }
        });
    }
}
