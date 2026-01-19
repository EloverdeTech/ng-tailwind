import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    TemplateRef,
    output,
    signal,
    WritableSignal,
} from '@angular/core';

export enum NgtPopoverPosition {
    DEFAULT = 'TOP',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM',
}

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtPopoverTooltipComponent {
    /** Outputs */

    public readonly onMouseHoverEvent = output<void>();
    public readonly onMouseLeaveEvent = output<void>();

    /** Signals */

    public readonly popover: WritableSignal<string> = signal(null);
    public readonly popoverTemplate: WritableSignal<TemplateRef<any>> = signal(null);
    public readonly position: WritableSignal<NgtPopoverPosition> = signal(NgtPopoverPosition.DEFAULT);
    public readonly positionX: WritableSignal<number> = signal(null);
    public readonly positionY: WritableSignal<number> = signal(null);

    public positionClasses: any = {
        [NgtPopoverPosition.TOP]: '-mt-10',
        [NgtPopoverPosition.BOTTOM]: '-mb-10',
    };

    public readonly popoverTemplateStyle: WritableSignal<string> = signal('text-xxs');

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        this.onMouseLeaveEvent.emit();
    }

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        this.onMouseHoverEvent.emit();
    }
}
