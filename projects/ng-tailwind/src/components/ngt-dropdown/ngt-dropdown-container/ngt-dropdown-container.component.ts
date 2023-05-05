import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: '[ngt-dropdown-container]',
    templateUrl: './ngt-dropdown-container.component.html'
})
export class NgtDropdownContainerComponent {
    @Output() public onActiveDropdownChange = new EventEmitter();

    public setActiveDropdown(activeDropdown) {
        this.onActiveDropdownChange.emit(activeDropdown);
    }
}
