import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    input,
} from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-portlet-header',
    templateUrl: './ngt-portlet-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtPortletHeaderComponent {
    /** Inputs */

    public readonly caption = input<string>('');
    public readonly icon = input<string>('');
    public readonly iconSize = input<string>('text-xl');
    public readonly helperTitle = input<string>('');
    public readonly helperText = input<string>('');
    public readonly helperIconColor = input<string>('');

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

        this.ngtStyle.load(this.injector, 'NgtPortletHeader', {
            h: 'h-auto',
            w: 'w-auto',
            text: 'text-xl',
            font: 'font-medium',
            border: 'border-b',
            px: 'px-4',
            color: {}
        }, ['NgtPortletStyle']);
    }
}
