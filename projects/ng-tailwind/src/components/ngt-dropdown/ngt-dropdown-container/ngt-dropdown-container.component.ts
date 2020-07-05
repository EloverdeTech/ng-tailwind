import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: '[ngt-dropdown-container]',
    templateUrl: './ngt-dropdown-container.component.html',
    styleUrls: ['./ngt-dropdown-container.component.css']
})
export class NgtDropdownContainerComponent {
    @Output() public onActiveDropdownChange = new EventEmitter();

    public setActiveDropdown(activeDropdown) {
        this.onActiveDropdownChange.emit(activeDropdown);
    }
}
