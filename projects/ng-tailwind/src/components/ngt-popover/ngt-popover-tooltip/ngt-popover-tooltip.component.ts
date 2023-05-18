import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, TemplateRef } from '@angular/core';

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
    public popover: string;
    public popoverTemplate: TemplateRef<any>;
    public position: NgtPopoverPosition = NgtPopoverPosition.DEFAULT;

    public positionClasses: any = {
        [NgtPopoverPosition.TOP]: 'top-0 -mt-10',
        [NgtPopoverPosition.BOTTOM]: 'bottom-0 -mb-10',
    };
}

export enum NgtPopoverPosition {
    DEFAULT = 'TOP',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
}
