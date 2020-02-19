import { Component } from '@angular/core';

@Component({
  selector: '[ngt-tr]',
  templateUrl: './ngt-tr.component.html',
  styleUrls: ['./ngt-tr.component.css'],
  host: { class: 'border-r border-t md:border-r-0 md:border-t-0' }
})
export class NgtTrComponent { }
