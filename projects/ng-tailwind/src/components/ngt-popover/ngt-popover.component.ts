import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    Optional,
    Self,
    ViewChild,
    input,
    output,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

export enum NgtPopoverOpenMethod {
    CLICK = 'CLICK',
    POPOVER_CLICK = 'POPOVER_CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}

@Component({
    selector: 'ngt-popover',
    templateUrl: './ngt-popover.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class NgtPopoverComponent {
    @ViewChild('dropdownRef', { static: true }) public dropdownRef: ElementRef;
    @ViewChild('hostDiv') public hostDiv: ElementRef;

    /** Inputs */

    public readonly closeTimeout = input<number>();
    public readonly openMethod = input<string>(NgtPopoverOpenMethod.HOVER);

    public readonly closeOnClick = input<boolean>(false);
    public readonly placeOnBottom = input<boolean>(false);
    public readonly placeOnLeft = input<boolean>(false);

    /** Outputs */

    public readonly onClick = output<void>();

    public ngtStyle: NgtStylizableService;

    public stylesToCompile: Array<string> = ['h', 'w', 'px', 'py', 'm', 'mx', 'my', 'shadow', 'text', 'border', 'color.border', 'color.bg', 'color.text'];

    private clickTimeout: any;

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,
        @Optional()
        public ngtTranslateService: NgtTranslateService,
        private injector: Injector,
    ) {
        this.setupNgtStylizable();
    }

    public fireClickEvent(): void {
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
        }

        this.clickTimeout = setTimeout(() => {
            this.onClick.emit();

            const event = new MouseEvent('click', { bubbles: true });

            event.preventDefault();
            event.stopPropagation();

            this.hostDiv.nativeElement.dispatchEvent(event);
        }, 500);
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtPopover', {
            text: 'text-sm',
            fontCase: '',
            py: 'py-3',
            px: 'px-2',
            border: 'border',
            color: {
                border: 'border-gray-400',
                text: 'text-black',
                bg: 'bg-white'
            },
        });
    }
}
