import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    Signal,
    computed,
    input,
    signal,
    WritableSignal,
} from '@angular/core';
import { NgtAbilityValidationService } from '../../../services/validation/ngt-ability-validation.service';
import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-modal-body',
    templateUrl: './ngt-modal-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtModalBodyComponent implements AfterViewInit {
    /** Inputs */

    public readonly ngtStyle = input<NgtStylizableService>();
    public readonly isDisabled = input<boolean>();

    /** Computed Signals */

    public readonly isDisabledState: Signal<boolean> = computed(
        () => (this.isDisabled() === undefined ? this.internalDisabledState() : this.isDisabled())
    );

    public readonly resolvedStyle: Signal<NgtStylizableService> = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    /** Internal */

    private readonly internalDisabledState: WritableSignal<boolean> = signal(false);
    private localStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
    ) {
        this.setupNgtStylizable();
    }

    public async ngAfterViewInit(): Promise<void> {
        if (this.isDisabled() === undefined && this.ngtAbilityValidationService) {
            this.internalDisabledState.set(
                !(await this.ngtAbilityValidationService.hasManagePermission())
            );
        }
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.tailStylizableDirective
            ? this.tailStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'NgtModalBody', {
            px: 'px-0',
            py: 'py-0'
        });
    }
}
