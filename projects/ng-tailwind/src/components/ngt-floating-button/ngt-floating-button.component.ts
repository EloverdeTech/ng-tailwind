import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Input, Optional, Self } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-floating-button',
    templateUrl: './ngt-floating-button.component.html',
    styleUrls: ['./ngt-floating-button.component.css'],
    animations: [
        trigger('fadeY', [
            state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
            transition(':enter, :leave', [
                animate(300)
            ])
        ]),

        trigger('openClose', [
            state('open', style({
                transform: 'rotate(180deg)'
            })),
            state('closed', style({
                transform: 'rotate(-180deg)'
            })),
            transition('open => closed', [
                animate('0.5s ease-in')
            ]),
            transition('closed => open', [
                animate('0.5s ease-in')
            ]),
        ]),
    ]
})
export class NgtFloatingButtonComponent {
    @Input() public menus: Array<NgtFloatingButtonMenu>;
    @Input() public icon: string;
    @Input() public label: string;
    @Input() public withAnimation: boolean = false;

    public isOpen: boolean = false;
    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtFloatingButton', {
            color: {
                bg: 'bg-blue-500',
                text: 'text-white',
            },
            px: 'px-4',
            py: 'py-4',
            h: 'h-12',
            w: 'w-12'
        });
    }

    public toggleMenu() {
        this.isOpen = !(this.isOpen);
    }

    public openExternalLink(url: string) {
        window.open(url, "_blank");
        this.toggleMenu();
    }

    public onClick(event: Event, menu: NgtFloatingButtonMenu) {
        event.stopPropagation();
        this.toggleMenu();

        if (typeof menu.action === 'function') {
            return menu.action();
        }

        throw new Error('Action must be a function!');
    }

    public isTypeAction(menu: NgtFloatingButtonMenu) {
        return menu.type == NgtFloatingButtonType.ACTION;
    }

    public isTypeNavigation(menu: NgtFloatingButtonMenu) {
        return menu.type == NgtFloatingButtonType.NAVIGATION;
    }
}

export interface NgtFloatingButtonMenu {
    name?: string;
    type: NgtFloatingButtonType;
    icon?: string;
    tooltip?: string;
    externalLink?: boolean;
    url?: string;
    action?: Function;
}

export enum NgtFloatingButtonType {
    NAVIGATION = 'NAVIGATION',
    ACTION = 'ACTION'
}
