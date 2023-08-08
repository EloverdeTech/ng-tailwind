import {
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';

import { NgtPopoverPosition, NgtPopoverTooltipComponent } from './ngt-popover-tooltip/ngt-popover-tooltip.component';
import { NgtPopoverOpenMethod } from './ngt-popover.component';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[ngt-popover]'
})
export class NgtPopoverDirective implements OnDestroy {
    @Input() public ngtPopoverContent: string;
    @Input() public ngtPopoverTemplate: TemplateRef<any>;
    @Input() public ngtPopoverPosition: NgtPopoverPosition = NgtPopoverPosition.DEFAULT;

    @Input() public dismissDelay: number = 1000;
    @Input() public showDelay: number = 1000;
    @Input() public closeOnClick: boolean;
    @Input() public openMethod: 'HOVER' | 'CLICK' = NgtPopoverOpenMethod.HOVER;

    private componentRef: ComponentRef<NgtPopoverTooltipComponent> = null;
    private dismissTimeoutInstance: NodeJS.Timeout;
    private showTimeoutInstance: NodeJS.Timeout;

    private toolTipMouseHoverSubscription: Subscription;
    private toolTipMouseLeaveSubscription: Subscription;

    public constructor(
        private elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef
    ) { }

    @HostListener('click')
    public onClick(): void {
        if (this.openMethod != NgtPopoverOpenMethod.CLICK) {
            return;
        }

        if (!this.componentRef) {
            this.createPopover();

            return;
        }

        this.destroy();
    }

    @HostListener('document:click', ['$event.target'])
    public onDocumentClick(target: HTMLElement) {
        if (
            this.closeOnClick
            && !this.componentRef?.location?.nativeElement?.contains(target)
            && target !== this.elementRef.nativeElement
            && target !== this.componentRef?.location?.nativeElement
        ) {
            this.destroy();
        }
    }

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        if (this.showTimeoutInstance) {
            clearTimeout(this.showTimeoutInstance);
        }

        if (this.closeOnClick) {
            return;
        }

        if (this.dismissTimeoutInstance) {
            clearTimeout(this.dismissTimeoutInstance);
        }

        this.dismissTimeoutInstance = setTimeout(() => this.destroy(), this.dismissDelay);
    }

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        if (this.componentRef || this.openMethod != NgtPopoverOpenMethod.HOVER) {
            return;
        }

        this.showTimeoutInstance = setTimeout(() => this.createPopover(), this.showDelay);
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    private createPopover(): void {
        this.componentRef = this.viewContainerRef.createComponent(NgtPopoverTooltipComponent);

        this.setupPopoverComponent();
    }

    private destroy(): void {
        this.toolTipMouseHoverSubscription?.unsubscribe();
        this.toolTipMouseLeaveSubscription?.unsubscribe();
        this.componentRef?.destroy();
        this.componentRef = null;
    }

    private setupPopoverComponent(): void {
        if (!this.componentRef) {
            return;
        }

        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        this.componentRef.instance.positionX = rect.left;
        this.componentRef.instance.positionY = (this.ngtPopoverPosition === NgtPopoverPosition.TOP)
            ? rect.top
            : rect.bottom;

        this.componentRef.instance.popover = this.ngtPopoverContent;
        this.componentRef.instance.popoverTemplate = this.ngtPopoverTemplate;
        this.componentRef.instance.position = this.ngtPopoverPosition;

        this.bindSubscriptions();

        document.body.appendChild(this.componentRef.location.nativeElement);
    }

    private bindSubscriptions(): void {
        this.toolTipMouseHoverSubscription = this.componentRef.instance
            .onMouseHoverEvent
            .subscribe(() => {
                if(this.dismissTimeoutInstance){
                    clearTimeout(this.dismissTimeoutInstance);
                }
            });

        this.toolTipMouseLeaveSubscription = this.componentRef.instance
            .onMouseLeaveEvent
            .subscribe(() => this.onMouseLeave());
    }
}
