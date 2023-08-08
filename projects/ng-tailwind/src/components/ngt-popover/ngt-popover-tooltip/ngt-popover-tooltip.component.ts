import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'ngt-popover-tooltip',
    templateUrl: './ngt-popover-tooltip.component.html',
    animations: [
        trigger('enterAnimation', [
            state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
            transition(':enter', [
                animate(200)
            ])
        ]),
    ]
})
export class NgtPopoverTooltipComponent{
    @Output() public onMouseHoverEvent: EventEmitter<NgtPopoverTooltipComponent> = new EventEmitter();
    @Output() public onMouseLeaveEvent: EventEmitter<NgtPopoverTooltipComponent> = new EventEmitter();

    public popover: string;
    public popoverTemplate: TemplateRef<any>;
    public position: NgtPopoverPosition = NgtPopoverPosition.DEFAULT;
    public positionX: number;
    public positionY: number;

    public positionClasses: any = {
        [NgtPopoverPosition.TOP]: '-mt-10',
        [NgtPopoverPosition.BOTTOM]: '-mb-10',
    };

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        this.onMouseLeaveEvent.emit();
    }

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        this.onMouseHoverEvent.emit();
    }
}

export enum NgtPopoverPosition {
    DEFAULT = 'TOP',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
}
