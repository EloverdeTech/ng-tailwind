import { Component, ElementRef, Injector, Input, Optional, Self, ViewChild } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-header-nav',
    templateUrl: './ngt-header-nav.component.html'
})
export class NgtHeaderNavComponent {
    @ViewChild('element', { static: true }) public element: ElementRef;

    @Input() public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'HeaderNav', {
            h: 'h-auto',
            color: {}
        });
    }

    public ngAfterViewInit() {
        this.element.nativeElement.classList.add('tail-animate-fade-up');
    }
}
