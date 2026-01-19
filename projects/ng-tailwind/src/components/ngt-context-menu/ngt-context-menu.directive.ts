import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    OutputRefSubscription,
    output,
    HostListener,
    input,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { NgtContextMenuComponent, NgtContextMenuOptionInterface } from './ngt-context-menu.component';

@Directive({
    selector: '[ngt-contextmenu]',
    standalone: false
})
export class NgtContextMenuDirective implements OnDestroy {
    public readonly onNgtContextMenuClick = output<NgtContextMenuOptionInterface>();
    public readonly onOpenNgtContextMenu = output<NgtContextMenuComponent>();

    public readonly ngtContextMenuOptions = input<NgtContextMenuOptionInterface[]>();
    public readonly ngtContextMenuTemplate = input<TemplateRef<any>>();

    private componentRef: ComponentRef<NgtContextMenuComponent> = null;
    private menuItemClickSubscription: OutputRefSubscription;
    private templateClickSubscription: OutputRefSubscription;

    public constructor(
        private viewContainerRef: ViewContainerRef,
        private changeDetector: ChangeDetectorRef,
    ) { }

    @HostListener('contextmenu', ['$event'])
    public onContextMenu(event: MouseEvent) {
        event.preventDefault();

        setTimeout(() => {
            this.destroy();
            this.createComponent(event);
        }, 50);
    }

    @HostListener('document:contextmenu', ['$event'])
    public onDocumentContextMenuClick(event: MouseEvent) {
        event.preventDefault();

        this.destroy();
        this.changeDetector.detectChanges();
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

        this.componentRef.instance.positionX.set(event.clientX);
        this.componentRef.instance.positionY.set(event.clientY);
        this.componentRef.instance.menuItems.set(this.ngtContextMenuOptions() ?? []);
        this.componentRef.instance.menuTemplate.set(this.ngtContextMenuTemplate());

        this.bindSubscriptions();

        document.body.appendChild(this.componentRef.location.nativeElement);

        this.onOpenNgtContextMenu.emit(this.componentRef.instance);
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
