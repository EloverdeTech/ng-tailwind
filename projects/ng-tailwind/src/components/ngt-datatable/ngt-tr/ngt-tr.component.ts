import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: '[ngt-tr]',
  templateUrl: './ngt-tr.component.html',
  styleUrls: ['./ngt-tr.component.css'],
  host: { class: 'border-r border-t md:border-r-0 md:border-t-0' },
  encapsulation: ViewEncapsulation.None
})
export class NgtTrComponent {
  @HostBinding('class.evenStripped') @Input() evenStripped: boolean;
  @HostBinding('class.oddStripped') @Input() oddStripped: boolean;
}
