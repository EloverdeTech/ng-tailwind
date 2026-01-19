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

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-content',
    templateUrl: './ngt-content.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtContentComponent {
    /** Inputs */

    public readonly ngtStyle = input<NgtStylizableService>();

    /** Computed Signals */

    public readonly resolvedStyle: Signal<NgtStylizableService> = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    public readonly contentClass: Signal<string> = computed(
        () => `flex-grow ${this.resolvedStyle().compile(['color.bg'])}`
    );

    /** Internal */

    private localStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private tailStylizableDirective: NgtStylizableDirective
    ) {
        this.setupNgtStylizable();
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.tailStylizableDirective
            ? this.tailStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'Content', {
            color: {}
        });
    }
}
