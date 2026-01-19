import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
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
    selector: 'ngt-modal-header',
    templateUrl: './ngt-modal-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtModalHeaderComponent {
    public static onCloseModalByHeader: EventEmitter<void> = new EventEmitter();

    /** Inputs */

    public readonly disableDefaultCloses = input<boolean>(false);
    public readonly ngtStyle = input<NgtStylizableService>();

    /** Computed Signals */

    public readonly resolvedStyle: Signal<NgtStylizableService> = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    /** Internal */

    private localStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private tailStylizableDirective: NgtStylizableDirective
    ) {
        this.setupNgtStylizable();
    }

    public emitOnCloseEvent(): void {
        NgtModalHeaderComponent.onCloseModalByHeader.emit();
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.tailStylizableDirective
            ? this.tailStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'NgtModalHeader', {
            pb: 'pb-3',
            color: {}
        });
    }
}
