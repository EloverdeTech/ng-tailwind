import {
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
    input,
 OutputRefSubscription
} from '@angular/core';

import { NgtPopoverPosition, NgtPopoverTooltipComponent } from './ngt-popover-tooltip/ngt-popover-tooltip.component';
import { NgtPopoverOpenMethod } from './ngt-popover.component';

@Directive({
    selector: '[ngt-popover]',
    standalone: false
})
export class NgtPopoverDirective implements OnDestroy {
    public readonly ngtPopoverContent = input<string>();
    public readonly ngtPopoverTemplate = input<TemplateRef<any>>();
    public readonly ngtPopoverPosition = input<NgtPopoverPosition>(NgtPopoverPosition.DEFAULT);
    public readonly ngtPopoverTemplateStyle = input<string>('text-xxs');

    public readonly dismissDelay = input<number>(1000);
    public readonly showDelay = input<number>(1000);
    public readonly closeOnClick = input<boolean>(false);
    public readonly openMethod = input<'HOVER' | 'CLICK'>(NgtPopoverOpenMethod.HOVER);

    private componentRef: ComponentRef<NgtPopoverTooltipComponent> = null;
    private dismissTimeoutInstance: any;
    private showTimeoutInstance: any;

    private toolTipMouseHoverSubscription: OutputRefSubscription;
    private toolTipMouseLeaveSubscription: OutputRefSubscription;

    public constructor(
        private elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef
    ) { }

    @HostListener('click')
    public onClick(): void {
        if (this.openMethod() != NgtPopoverOpenMethod.CLICK) {
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
            this.closeOnClick()
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

        if (this.closeOnClick()) {
            return;
        }

        if (this.dismissTimeoutInstance) {
            clearTimeout(this.dismissTimeoutInstance);
        }

        this.dismissTimeoutInstance = setTimeout(() => this.destroy(), this.dismissDelay());
    }

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        if (this.componentRef || this.openMethod() != NgtPopoverOpenMethod.HOVER) {
            return;
        }

        this.showTimeoutInstance = setTimeout(() => this.createPopover(), this.showDelay());
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

        this.componentRef.instance.positionX.set(rect.left);
        this.componentRef.instance.positionY.set(
            (this.ngtPopoverPosition() === NgtPopoverPosition.TOP)
                ? rect.top
                : rect.bottom
        );

        this.componentRef.instance.popover.set(this.ngtPopoverContent());
        this.componentRef.instance.popoverTemplate.set(this.ngtPopoverTemplate());
        this.componentRef.instance.position.set(this.ngtPopoverPosition());
        this.componentRef.instance.popoverTemplateStyle.set(this.ngtPopoverTemplateStyle());

        this.bindSubscriptions();

        document.body.appendChild(this.componentRef.location.nativeElement);
    }

    private bindSubscriptions(): void {
        this.toolTipMouseHoverSubscription = this.componentRef.instance
            .onMouseHoverEvent
            .subscribe(() => {
                if (this.dismissTimeoutInstance) {
                    clearTimeout(this.dismissTimeoutInstance);
                }
            });

        this.toolTipMouseLeaveSubscription = this.componentRef.instance
            .onMouseLeaveEvent
            .subscribe(() => this.onMouseLeave());
    }
}
