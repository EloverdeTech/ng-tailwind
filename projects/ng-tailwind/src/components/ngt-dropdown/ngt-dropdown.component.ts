import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, Optional, Output, SimpleChanges, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { getEnumFromString } from '../../helpers/enum/enum';
import { uuid } from '../../helpers/uuid';
import { NgtDropdownContainerComponent } from './ngt-dropdown-container/ngt-dropdown-container.component';

@Component({
    selector: 'ngt-dropdown',
    templateUrl: './ngt-dropdown.component.html',
    styleUrls: ['./ngt-dropdown.component.css'],
    animations: [
        trigger('openClose', [
            state('open', style({ opacity: 1, transform: 'translateY(0px)' })),
            state('closed', style({ opacity: 0, transform: 'translateY(-10px)' })),
            transition('closed => open', [
                animate(300)
            ]),
        ]),
    ]
})
export class NgtDropdownComponent implements OnDestroy {
    @Input() public icon: string;
    @Input() public iconClass: string = 'text-xl self-center mr-3 text-white';
    @Input() public imageIcon: string;
    @Input() public label: string;
    @Input() public labelClass: string = 'text-md font-semibold mr-4 text-white';
    @Input() public headerBg: any;
    @Input() public withFooter: boolean = false;
    @Input() public badge: any;
    @Input() public withHeader: boolean = true;
    @Input() public withArrow: boolean = false;
    @Input() public reversePosition: boolean = false;
    @Input() public closeOnClick: boolean = false;
    @Input() public openMethod: NgtDropdownOpenMethod = NgtDropdownOpenMethod.HOVER;

    @Output() public onToggle: EventEmitter<boolean> = new EventEmitter();

    public name = uuid();
    public isOpen: boolean = false;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @SkipSelf()
        private ngtDropdownContainer: NgtDropdownContainerComponent
    ) {
        if (this.ngtDropdownContainer) {
            this.subscriptions.push(
                this.ngtDropdownContainer.onActiveDropdownChange.subscribe((activeDropdown: NgtDropdownComponent) => {
                    this.isOpen = (activeDropdown.name === this.name);
                })
            );
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public open() {
        this.isOpen = true;

        if (this.ngtDropdownContainer) {
            this.ngtDropdownContainer.setActiveDropdown(this);
        }
    }

    public closeOnSelectOption() {
        if (this.closeOnClick) {
            this.close();
        }
    }

    public close() {
        this.isOpen = false;
    }

    public toggle() {
        setTimeout(() => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }

            this.onToggle.emit(this.isOpen);
        });
    }

    public onHover(host, container) {
        if (this.openMethod == NgtDropdownOpenMethod.HOVER && host && container) {
            this.open();
            this.watchHover(host, container);
        }
    }

    public onClick(event: any) {
        if (this.openMethod == NgtDropdownOpenMethod.CLICK) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        }
    }

    public onRightClick(event: any) {
        if (this.openMethod == NgtDropdownOpenMethod.RIGHT_CLICK) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        }
    }

    public watchHover(host, container) {
        let interval = setInterval(() => {
            if (!host || !container || !this.isInHover(host, container)) {
                this.isOpen = false;
                clearInterval(interval);
            }
        }, 1000);
    }

    public isInHover(host: any, container: any) {
        return host.parentElement.querySelector(':hover') == host ||
            container.parentElement.querySelector(':hover') == container;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.openMethod) {
            this.openMethod = getEnumFromString(changes.openMethod.currentValue, NgtDropdownOpenMethod);
        }
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtDropdownOpenMethod {
    CLICK = 'CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}
