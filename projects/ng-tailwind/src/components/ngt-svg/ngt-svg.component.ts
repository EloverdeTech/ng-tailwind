import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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
export class NgtSvgComponent implements AfterViewChecked {

  @Input() src;
  @Input() class: string = null;

  @ViewChild(SvgIconComponent, { static: true, read: ElementRef }) private svgIconElement: ElementRef;

  private appliedClass = null;

  ngAfterViewChecked() {
    if (this.appliedClass !== this.class) {
      if (this.svgIconElement && this.svgIconElement.nativeElement) {
        let svgElement = <SVGAElement>this.svgIconElement.nativeElement.querySelector('svg');
        if (svgElement) {

          while (svgElement.classList.length > 0) {
            svgElement.classList.remove(svgElement.classList.item(0));
          }

          svgElement.classList.add('fill-current');
          svgElement.classList.add('self-center');
          
          this.class.split(' ').forEach(className => svgElement.classList.add(className));
          this.appliedClass = this.class;
        }
      }
    }
  }

}
