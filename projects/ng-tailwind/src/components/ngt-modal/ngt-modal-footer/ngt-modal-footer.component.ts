import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    Signal,
    computed,
    input,
} from '@angular/core';
import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-modal-footer',
    templateUrl: './ngt-modal-footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtModalFooterComponent {
    /** Inputs */

    public readonly ngtStyle = input<NgtStylizableService>();

    /** Computed Signals */

    public readonly resolvedStyle: Signal<NgtStylizableService> = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    /** Internal */

    private localStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.tailStylizableDirective
            ? this.tailStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'NgtModalFooter', {
            px: 'px-0',
            py: 'py-1'
        });
    }
}
