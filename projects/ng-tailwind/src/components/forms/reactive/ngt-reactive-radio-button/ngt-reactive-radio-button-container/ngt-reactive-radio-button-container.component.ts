import { ChangeDetectionStrategy, Component, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgtReactiveRadioButtonComponent } from '../ngt-reactive-radio-button.component';

@Component({
    selector: '[ngt-reactive-radio-button-container]',
    templateUrl: './ngt-reactive-radio-button-container.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
    ],
})
export class NgtReactiveRadioButtonContainerComponent {
    public readonly onActiveRadioButtonChange: OutputEmitterRef<NgtReactiveRadioButtonComponent> = output<NgtReactiveRadioButtonComponent>();

    public setActiveRadioButton(activeRadioButton: NgtReactiveRadioButtonComponent): void {
        this.onActiveRadioButtonChange.emit(activeRadioButton);
    }
}
