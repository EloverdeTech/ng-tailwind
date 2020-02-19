import { Component } from '@angular/core';

@Component({
  selector: '[ngt-td]',
  templateUrl: './ngt-td.component.html',
  styleUrls: ['./ngt-td.component.css'],
  host: { class: 'py-4 px-6 border-b break-words' }
})
export class NgtTdComponent {
  constructor() { }
}
