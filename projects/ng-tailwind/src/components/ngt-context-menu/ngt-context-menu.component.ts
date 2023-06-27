import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'ngt-context-menu',
    templateUrl: './ngt-context-menu.component.html'
})

export class NgtContextMenuComponent {
    @Output() public onMenuItemClick: EventEmitter<NgtContextMenuOptionInterface> = new EventEmitter();
    @Output() public onTemplateClick: EventEmitter<void> = new EventEmitter();

    public positionX: number;
    public positionY: number;

    public menuTemplate: TemplateRef<any>;
    public menuItems: NgtContextMenuOptionInterface[] = [];

    public hasOptions(): boolean {
        return !this.menuTemplate && !!this.menuItems?.length;
    }
}

export interface NgtContextMenuOptionInterface {
    caption: string;
    background_color?: string;
    icon?: string;
    value: string;
}
