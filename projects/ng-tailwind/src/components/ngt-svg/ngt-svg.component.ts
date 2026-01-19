import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
    effect,
    input,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
    selector: 'ngt-svg',
    templateUrl: './ngt-svg.component.html',
    styleUrls: ['./ngt-svg.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex justify-center'
    },
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class NgtSvgComponent implements AfterViewInit, OnDestroy {
    @ViewChild(SvgIconComponent, { static: true, read: ElementRef }) private svgIconElement: ElementRef;

    /** Inputs */

    public readonly src = input<string>();
    public readonly class = input<string>('');

    private mutationObserver: MutationObserver;

    public constructor() {
        effect(() => {
            this.class();
            this.applySvgClasses();
        });
    }

    public ngAfterViewInit(): void {
        this.mutationObserver = new MutationObserver(() => this.applySvgClasses());

        if (this.svgIconElement?.nativeElement) {
            this.mutationObserver.observe(this.svgIconElement.nativeElement, {
                childList: true,
                subtree: true,
            });
        }

        // effect(() => {
        //     this.class();
        //     this.applySvgClasses();
        // });
    }

    public ngOnDestroy(): void {
        this.mutationObserver?.disconnect();
        this.mutationObserver = null;
    }

    private applySvgClasses(): void {
        const host = this.svgIconElement?.nativeElement;

        if (!host) {
            return;
        }

        const svgElement = host.querySelector('svg') as SVGElement;

        if (!svgElement) {
            return;
        }

        while (svgElement.classList.length > 0) {
            svgElement.classList.remove(svgElement.classList.item(0));
        }

        // svgElement.classList.add('fill-current');
        // svgElement.classList.add('self-center');

        `${this.class()}`.trim().split(' ').forEach(className => {
            if (className) {
                svgElement.classList.add(className);
            }
        });
    }
}
