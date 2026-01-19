import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    Optional,
    Self,
} from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: '[ngt-td]',
    templateUrl: './ngt-td.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtTdComponent {
    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtTd', {
            py: 'py-4',
            px: 'px-5',
            border: 'border-b',
            break: 'break-words',
            color: {
                bg: '',
                text: '',
                border: ''
            }
        });

        this.hostElement.nativeElement.classList += this.ngtStyle.compile([
            'h',
            'px',
            'py',
            'pb',
            'pl',
            'pr',
            'pt',
            'mb',
            'ml',
            'mr',
            'mt',
            'border',
            'color.bg',
            'color.text',
            'color.border',
            'text',
            'font',
            'break'
        ]);
    }
}
