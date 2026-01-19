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

export enum NgtShiningWidth {
    xs = 'xs',
    sm = 'sm',
    lg = 'lg',
    xl = 'xl',
}

@Component({
    selector: 'ngt-shining',
    templateUrl: './ngt-shining.component.html',
    styleUrls: ['./ngt-shining.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtShiningComponent {
    /** Inputs */

    public readonly shiningWidth = input<NgtShiningWidth>(NgtShiningWidth.xs);

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

        this.ngtStyle.load(this.injector, 'NgtShining', {
            rounded: 'rounded-none',
        });
    }
}
