import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Optional,
    Output,
    SimpleChanges,
    SkipSelf,
    ViewChild,
} from '@angular/core';
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
    @ViewChild('container', { static: true }) public containerRef: ElementRef;

    @Input() public autoXReverse: boolean;
    @Input() public autoYReverse: boolean = true;
    @Input() public reverseXPosition: boolean;
    @Input() public reverseYPosition: boolean;
    @Input() public closeOnClick: boolean;
    @Input() public closeTimeout: number = 1000;
    @Input() public openMethod: NgtDropdownOpenMethod = NgtDropdownOpenMethod.HOVER;

    @Output() public onToggle: EventEmitter<boolean> = new EventEmitter();
    @Output() public onHostClick: EventEmitter<any> = new EventEmitter();

    public name: string = uuid();
    public isOpen: boolean;
    public isYPositionReversed: boolean = false;
    public isXPositionReversed: boolean = false;
    public isBindingYPosition: boolean = true;
    public isBindingXPosition: boolean = true;

    private subscriptions: Array<Subscription> = [];
    private containerXPosition: number;
    private containerYPosition: number;

    private closeTimeoutInstance;

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

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.openMethod) {
            this.openMethod = getEnumFromString(changes.openMethod.currentValue, NgtDropdownOpenMethod);
        }
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public open(): void {
        this.isOpen = true;
        this.ngtDropdownContainer?.setActiveDropdown(this);
    }

    public closeOnSelectOption(): void {
        if (this.closeOnClick) {
            this.close();
        }
    }

    public close(): void {
        this.isOpen = false;
        this.containerXPosition = null;
        this.containerYPosition = null;
    }

    public toggle(): void {
        setTimeout(() => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }

            this.onToggle.emit(this.isOpen);
        });
    }

    public onHover(host: any, container: any): void {
        if (this.openMethod == NgtDropdownOpenMethod.HOVER && host && container) {
            this.open();
            this.watchHover(host, container);
        }
    }

    public onClick(event: Event, host: any, container: any): void {
        this.onHostClick?.emit();

        if (this.isClickMethod()) {
            event.preventDefault();
            event.stopPropagation();

            this.toggle();
        }

        if (this.openMethod == NgtDropdownOpenMethod.POPOVER_CLICK) {
            this.watchHover(host, container);
        }
    }

    public onRightClick(event: Event): void {
        if (this.openMethod == NgtDropdownOpenMethod.RIGHT_CLICK) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        }
    }

    public shouldReverseXPosition(): boolean {
        if (!this.autoXReverse || this.reverseXPosition !== undefined) {
            return this.reverseXPosition;
        }

        if (this.isOpen) {
            this.bindContainerXPosition();

            this.isXPositionReversed = !(this.containerXPosition > document.documentElement.clientWidth);

            return !this.isBindingXPosition && this.isXPositionReversed;
        }
    }

    public shouldReverseYPosition(): boolean {
        if (!this.autoYReverse || this.reverseYPosition !== undefined) {
            return this.reverseYPosition;
        }

        if (this.isOpen) {
            this.bindContainerYPosition();

            this.isYPositionReversed = this.containerYPosition > (document.documentElement.clientHeight * 0.9);

            return !this.isBindingYPosition && this.isYPositionReversed;
        }
    }

    private bindContainerXPosition(): void {
        if (!this.containerXPosition && this.containerRef.nativeElement.offsetWidth) {
            this.isBindingXPosition = true;

            setTimeout(() => {
                this.containerXPosition = this.containerRef.nativeElement.getBoundingClientRect().x
                    + this.containerRef.nativeElement.offsetWidth;

                this.isBindingXPosition = false;
            });
        }
    }

    private bindContainerYPosition(): void {
        if (!this.containerYPosition && this.containerRef?.nativeElement.offsetHeight) {
            this.isBindingYPosition = true;

            setTimeout(() => {
                this.containerYPosition = this.containerRef.nativeElement.getBoundingClientRect().y
                    + this.containerRef.nativeElement.offsetHeight;

                this.isBindingYPosition = false;
            });
        }
    }

    private watchHover(host: any, container: any): void {
        const interval = setInterval(() => {
            if (!host || !container || !this.isInHover(host, container)) {
                this.close();
                clearInterval(interval);
            }
        }, this.closeTimeout);
    }

    private isInHover(host: any, container: any): boolean {
        return host.parentElement.querySelector(':hover') == host ||
            container.parentElement.querySelector(':hover') == container;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private isClickMethod(): boolean {
        return this.openMethod == NgtDropdownOpenMethod.CLICK
            || this.openMethod == NgtDropdownOpenMethod.POPOVER_CLICK;
    }
}

export enum NgtDropdownOpenMethod {
    CLICK = 'CLICK',
    POPOVER_CLICK = 'POPOVER_CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}
