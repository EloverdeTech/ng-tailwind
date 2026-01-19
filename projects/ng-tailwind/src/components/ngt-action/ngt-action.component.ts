import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    SkipSelf,
    Signal,
    computed,
    input,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../forms/template-driven/ngt-form/ngt-form.component';
import { NgtReactiveFormComponent } from '../forms/reactive/ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtModalBodyComponent } from '../ngt-modal/ngt-modal-body/ngt-modal-body.component';

@Component({
    selector: 'ngt-action',
    templateUrl: './ngt-action.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtActionComponent {
    /** Inputs */

    public readonly href = input<string>();
    public readonly icon = input<string>();
    public readonly ngtStyle = input<NgtStylizableService>();
    public readonly isDisabled = input<boolean>(false);
    public readonly forceEnable = input<boolean>(false);

    /** Computed Signals */

    public readonly resolvedStyle: Signal<NgtStylizableService> = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabled()
            || this.ngtReactiveForm?.isDisabledState()
            || this.ngtSection?.isDisabledState()
            || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => !this.forceEnable() && (this.isDisabled() || this.isDisabledByParent())
    );

    public readonly anchorClass: Signal<string> = computed(
        () => this.isDisabledState()
            ? 'block rounded-full cursor-not-allowed text-gray-600 bg-gray-400 hover:bg-gray-400 opacity-50'
            : 'cursor-pointer'
    );

    public readonly containerClass: Signal<string> = computed(
        () => `flex justify-center rounded-full ${this.resolvedStyle().compile(['h', 'w', 'color.bg', 'color.text', 'px', 'py', 'shadow', 'text'])}`
    );

    public readonly containerClassWithBorder: Signal<string> = computed(
        () => `flex justify-center rounded-full ${this.resolvedStyle().compile(['h', 'w', 'color.bg', 'color.text', 'px', 'py', 'shadow', 'text', 'border', 'color.border'])}`
    );

    /** Internal */

    private localStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        public ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtReactiveForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        public ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        public ngtModal: NgtModalComponent,

        @Optional() @SkipSelf()
        public ngtModalBody: NgtModalBodyComponent
    ) {
        this.setupNgtStylizable();
    }

    public onClick(event: Event) {
        if (this.isDisabledState()) {
            event.stopPropagation();
        }
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'NgtAction', {
            h: 'h-full',
            w: 'w-full',
            color: {
                bg: 'bg-gray-500',
                text: 'text-white',
                border: '',
            },
            text: 'text-sm',
            border: 'border-0',
        });
    }
}
