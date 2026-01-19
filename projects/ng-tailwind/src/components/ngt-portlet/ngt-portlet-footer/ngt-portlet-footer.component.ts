import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
} from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-portlet-footer',
    templateUrl: './ngt-portlet-footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtPortletFooterComponent {
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

        this.ngtStyle.load(this.injector, 'NgtPortletFooter', {
            px: 'px-6',
            py: 'py-3',
            color: {
                bg: 'bg-gray-200',
                text: 'text-black'
            }
        }, ['NgtPortletStyle']);
    }
}
