import { ChangeDetectionStrategy, Component, output, signal, WritableSignal } from '@angular/core';
import { NgtDropdownComponent } from '../ngt-dropdown.component';

@Component({
    selector: '[ngt-dropdown-container]',
    templateUrl: './ngt-dropdown-container.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgtDropdownContainerComponent {
    public readonly onActiveDropdownChange = output<NgtDropdownComponent>();

    public readonly activeDropdown: WritableSignal<NgtDropdownComponent | null> = signal(null);

    public setActiveDropdown(activeDropdown: NgtDropdownComponent): void {
        this.activeDropdown.set(activeDropdown);
        this.onActiveDropdownChange.emit(activeDropdown);
    }
}
