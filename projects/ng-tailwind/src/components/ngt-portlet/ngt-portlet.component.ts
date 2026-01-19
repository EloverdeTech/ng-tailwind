import { animate, state, style, transition, trigger } from '@angular/animations';
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
    selector: 'ngt-portlet',
    templateUrl: './ngt-portlet.component.html',
    animations: [
        trigger('fadeUp', [
            state('void', style({ transform: 'translateY(20px)', opacity: 0 })),
            transition(':enter', [
                animate(500)
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtPortletComponent {
    /** Inputs */

    public readonly caption = input<string>();
    public readonly icon = input<string>(null);
    public readonly customLayout = input<boolean>(false);
    public readonly withFooter = input<boolean>(false);
    public readonly withBody = input<boolean>(true);
    public readonly helpTitle = input<string>('');
    public readonly helpText = input<string>('');
    public readonly helpIconColor = input<string>('');

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

        this.ngtStyle.load(this.injector, 'NgtPortlet', {
            h: 'h-auto',
            shadow: 'shadow',
            color: {}
        });
    }
}
