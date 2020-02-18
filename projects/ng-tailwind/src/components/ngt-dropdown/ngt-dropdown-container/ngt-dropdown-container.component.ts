import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngt-dropdown-container',
  templateUrl: './ngt-dropdown-container.component.html',
  styleUrls: ['./ngt-dropdown-container.component.css']
})
export class NgtDropdownContainerComponent {
  public activeMenu = new EventEmitter();
}
