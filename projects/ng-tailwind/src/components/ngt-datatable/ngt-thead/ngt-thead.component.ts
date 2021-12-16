import { Component, ElementRef, Injector, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: '[ngt-thead]',
    templateUrl: './ngt-thead.component.html',
    styleUrls: ['./ngt-thead.component.css'],
})
export class NgtTheadComponent {
    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtThead', {
            color: {
                bg: 'bg-gray-200',
                text: '',
                border: ''
            },
            my: '',
            border: '',
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
            'rounded'
        ]);
    }
}
