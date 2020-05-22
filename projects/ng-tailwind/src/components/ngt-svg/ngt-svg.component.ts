import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'ngt-svg',
  templateUrl: './ngt-svg.component.html',
  styleUrls: ['./ngt-svg.component.css'],
  host: {
    class: 'flex align-items-center'
  },
  encapsulation: ViewEncapsulation.None
})
export class NgtSvgComponent implements AfterViewChecked, OnChanges {

  @Input() src: string;
  @Input() class: string = null;

  @ViewChild(SvgIconComponent, { static: true, read: ElementRef }) private svgIconElement: ElementRef;

  private appliedClass = null;

  ngAfterViewChecked() {
    this.checkClassChange();
  }

  ngOnChanges(changes: SimpleChanges) {
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
