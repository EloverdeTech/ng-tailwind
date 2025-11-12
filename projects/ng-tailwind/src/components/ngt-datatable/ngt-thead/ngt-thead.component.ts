import { AfterViewInit, Component, ElementRef, Injector, Optional, Self, SkipSelf } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-thead]',
    templateUrl: './ngt-thead.component.html',
    standalone: false
})
export class NgtTheadComponent implements AfterViewInit {
    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @SkipSelf() @Optional() private ngtDatatable: NgtDatatableComponent,
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
            'rounded'
        ]);
    }

    public ngAfterViewInit(): void {
        this.applyHeadBgColor();
    }

    private applyHeadBgColor(): void {
        const headBgColor = (this.ngtDatatable && this.ngtDatatable.headBgColor) || 'bg-gray-200';
        const element = this.hostElement.nativeElement;

        Array.from(element.classList).forEach((cls: string) => {
            if (cls.startsWith('bg-')) {
                element.classList.remove(cls);
            }
        });

        element.classList.add(headBgColor);
    }
}
