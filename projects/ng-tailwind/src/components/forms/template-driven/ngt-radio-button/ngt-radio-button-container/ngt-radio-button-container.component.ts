import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { NgtRadioButtonComponent } from '../ngt-radio-button.component';

@Component({
    selector: '[ngt-radio-button-container]',
    templateUrl: './ngt-radio-button-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtRadioButtonContainerComponent {
    public readonly onActiveRadioButtonChange = output<NgtRadioButtonComponent>();

    public setActiveRadioButton(activeRadioButton: NgtRadioButtonComponent): void {
        this.onActiveRadioButtonChange.emit(activeRadioButton);
    }
}
