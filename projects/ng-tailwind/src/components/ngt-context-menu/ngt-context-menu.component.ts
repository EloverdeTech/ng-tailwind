import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    computed,
    output,
    signal,
    WritableSignal,
} from '@angular/core';

@Component({
    selector: 'ngt-context-menu',
    templateUrl: './ngt-context-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class NgtContextMenuComponent {
    /** Outputs */

    public readonly onMenuItemClick = output<NgtContextMenuOptionInterface>();
    public readonly onTemplateClick = output<void>();

    /** Signals */

    public readonly positionX: WritableSignal<number> = signal(0);
    public readonly positionY: WritableSignal<number> = signal(0);
    public readonly menuTemplate: WritableSignal<TemplateRef<any>> = signal(null);
    public readonly menuItems: WritableSignal<NgtContextMenuOptionInterface[]> = signal([]);

    public readonly hasOptions = computed(
        () => !this.menuTemplate() && !!this.menuItems()?.length
    );
}

export interface NgtContextMenuOptionInterface {
    caption: string;
    background_color?: string;
    icon?: string;
    value: string;
    disabled?: boolean;
}
