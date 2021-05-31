import {
    AfterViewChecked,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
    selector: 'ngt-svg',
    templateUrl: './ngt-svg.component.html',
    styleUrls: ['./ngt-svg.component.css'],
    host: {
        class: 'flex justify-center'
    },
    encapsulation: ViewEncapsulation.None
})
export class NgtSvgComponent implements AfterViewChecked, OnChanges {
    @Input() public src: string;
    @Input() public class: string = '';

    @ViewChild(SvgIconComponent, { static: true, read: ElementRef }) private svgIconElement: ElementRef;

    private appliedClass = null;

    public ngAfterViewChecked() {
        this.checkClassChange();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.appliedClass = null;
        this.checkClassChange();
    }

    private checkClassChange() {
        if (this.appliedClass !== this.class) {
            if (this.svgIconElement && this.svgIconElement.nativeElement) {
                let svgElement = <SVGAElement>this.svgIconElement.nativeElement.querySelector('svg');

                if (svgElement) {
                    while (svgElement.classList.length > 0) {
                        svgElement.classList.remove(svgElement.classList.item(0));
                    }

                    svgElement.classList.add('fill-current');
                    svgElement.classList.add('self-center');

                    new String(this.class).trim().split(' ').forEach(className => {
                        if (className) {
                            svgElement.classList.add(className);
                        }
                    });

                    this.appliedClass = this.class;
                }
            }
        }
    }
}
