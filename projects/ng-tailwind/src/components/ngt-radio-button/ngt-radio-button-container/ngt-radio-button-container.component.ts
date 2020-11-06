import { Component, EventEmitter, Output } from '@angular/core';

import { NgtRadioButtonComponent } from '../ngt-radio-button.component';

@Component({
    selector: '[ngt-radio-button-container]',
    templateUrl: './ngt-radio-button-container.component.html',
})
export class NgtRadioButtonContainerComponent {
    @Output() public onActiveRadioButtonChange = new EventEmitter();

    public setActiveRadioButton(activeRadioButton: NgtRadioButtonComponent) {
        this.onActiveRadioButtonChange.emit(activeRadioButton);
    }
}
