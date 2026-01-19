import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Optional,
    Self,
    input,
    signal,
    WritableSignal,
} from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

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

@Component({
    selector: 'ngt-floating-button',
    templateUrl: './ngt-floating-button.component.html',
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtFloatingButtonComponent {
    /** Inputs */

    public readonly menus = input<Array<NgtFloatingButtonMenu>>([]);
    public readonly icon = input<string>();
    public readonly label = input<string>();
    public readonly withAnimation = input<boolean>(false);

    public readonly isOpen: WritableSignal<boolean> = signal(false);
    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
    }

    public toggleMenu() {
        this.isOpen.set(!this.isOpen());
    }

    public openExternalLink(url: string) {
        window.open(url, '_blank');
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

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

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
}
