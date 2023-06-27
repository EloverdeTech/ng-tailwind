import {
    ComponentRef,
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtContextMenuComponent, NgtContextMenuOptionInterface } from './ngt-context-menu.component';

@Directive({
    selector: '[ngt-contextmenu]'
})
export class NgtContextMenuDirective implements OnDestroy {
    @Output() public onNgtContextMenuClick: EventEmitter<NgtContextMenuOptionInterface> = new EventEmitter();

    @Input() public ngtContextMenuOptions: NgtContextMenuOptionInterface[];
    @Input() public ngtContextMenuTemplate: TemplateRef<any>;

    private componentRef: ComponentRef<NgtContextMenuComponent> = null;
    private menuItemClickSubscription: Subscription;
    private templateClickSubscription: Subscription;

    public constructor(private viewContainerRef: ViewContainerRef) { }

    @HostListener('contextmenu', ['$event'])
    public onContextMenu(event: MouseEvent) {
        event.preventDefault();

        this.destroy();
        this.createComponent(event);
    }

    @HostListener('document:click')
    public onDocumentClick() {
        this.destroy();
    }

    @HostListener('click')
    public onClick() {
        this.destroy();
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    private createComponent(event: MouseEvent): void {
        this.componentRef = this.viewContainerRef.createComponent(NgtContextMenuComponent);

        this.componentRef.instance.positionX = event.clientX;
        this.componentRef.instance.positionY = event.clientY;
        this.componentRef.instance.menuItems = this.ngtContextMenuOptions;
        this.componentRef.instance.menuTemplate = this.ngtContextMenuTemplate;

        this.bindSubscriptions();

        document.body.appendChild(this.componentRef.location.nativeElement);
    }

    private bindSubscriptions(): void {
        this.menuItemClickSubscription = this.componentRef.instance
            .onMenuItemClick
            .subscribe((event) => {
                this.onNgtContextMenuClick.emit(event);

                this.destroy();
            });

        this.templateClickSubscription = this.componentRef.instance
            .onTemplateClick
            .subscribe((event) => this.destroy());
    }

    private destroy(): void {
        this.menuItemClickSubscription?.unsubscribe();
        this.templateClickSubscription?.unsubscribe();
        this.componentRef?.destroy();

        this.componentRef = null;
    }
}
