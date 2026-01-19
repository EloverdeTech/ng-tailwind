import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    Optional,
    Self,
    ViewChild,
    Signal,
    computed,
    input,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-header-nav',
    templateUrl: './ngt-header-nav.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtHeaderNavComponent implements AfterViewInit {
    @ViewChild('element', { static: true }) public element: ElementRef;

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
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
    ) {
        this.setupNgtStylizable();
    }

    public ngAfterViewInit(): void {
        this.element.nativeElement.classList.add('tail-animate-fade-up');
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'HeaderNav', {
            h: 'h-auto',
            color: {}
        });
    }
}
