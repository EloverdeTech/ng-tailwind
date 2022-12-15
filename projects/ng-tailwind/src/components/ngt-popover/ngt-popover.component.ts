import { Component, ElementRef, EventEmitter, Injector, Input, Optional, Output, Self, ViewChild } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-popover',
    templateUrl: './ngt-popover.component.html'
})

export class NgtPopoverComponent {
    @ViewChild('dropdownRef', { static: true }) public dropdownRef: ElementRef;
    @ViewChild('hostDiv') public hostDiv: ElementRef;

    @Input() public closeTimeout: number;
    @Input() public openMethod: string = NgtPopoverOpenMethod.HOVER;

    @Input() public closeOnClick: boolean;
    @Input() public placeOnBottom: boolean;

    @Output() public onClick: EventEmitter<any> = new EventEmitter();

    public ngtStyle: NgtStylizableService;

    public stylesToCompile: Array<string> = ['h', 'w', 'px', 'py', 'shadow', 'text', 'border', 'color.border', 'color.bg', 'color.text'];

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,
        @Optional()
        public ngtTranslateService: NgtTranslateService,
        private injector: Injector,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtHelper', {
            text: 'text-sm',
            fontCase: '',
            color: {
                text: 'text-black',
                bg: 'bg-gray-200'
            }
        });
    }

    public fireClickEvent(): void {
        this.onClick.emit();

        setTimeout(() => {
            const event = new MouseEvent('click', {bubbles: true});

            event.preventDefault();
            event.stopPropagation();
            this.hostDiv.nativeElement.dispatchEvent(event);
        }, 50);
    }
}

export enum NgtPopoverOpenMethod {
    CLICK = 'CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}
