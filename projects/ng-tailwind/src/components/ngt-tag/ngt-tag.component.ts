import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    input,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-tag',
    templateUrl: './ngt-tag.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtTagComponent {
    /** Inputs */

    public readonly icon = input<string>();

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'Tag', {
            color: {
                bg: 'bg-gray-500',
                text: 'text-white'
            }
        });
    }
}
