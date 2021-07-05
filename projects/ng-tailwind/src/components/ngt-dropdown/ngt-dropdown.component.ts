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
    @Input() public closeOnClick: boolean;
    @Input() public openMethod: NgtDropdownOpenMethod = NgtDropdownOpenMethod.HOVER;

    @Output() public onToggle: EventEmitter<boolean> = new EventEmitter();

    public name: string = uuid();
    public isOpen: boolean;
    public isYPositionReversed: boolean = false;
    public isXPositionReversed: boolean = false;

    private subscriptions: Array<Subscription> = [];
    private containerXPosition: number;
    private containerYPosition: number;

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

    public onClick(event: Event): void {
        if (this.openMethod == NgtDropdownOpenMethod.CLICK) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        }
    }

    public onRightClick(event: Event): void {
        if (this.openMethod == NgtDropdownOpenMethod.RIGHT_CLICK) {
            event.preventDefault();
            event.stopPropagation();
            this.toggle();
        }
    }

    public reversePositionX(): boolean {
        if (!this.autoXReverse) {
            return false;
        }

        if (this.isOpen) {
            this.bindDropdownContainerXPosition();
            this.isXPositionReversed = !(this.containerXPosition > document.documentElement.clientWidth);

            return this.isXPositionReversed;
        }
    }

    public reverseYPosition(): boolean {
        if (!this.autoYReverse) {
            return false;
        }

        if (this.isOpen) {
            this.bindContainerYPosition();
            this.isYPositionReversed = this.containerYPosition > (document.documentElement.clientHeight * 0.9);

            return this.isYPositionReversed;
        }
    }

    private bindDropdownContainerXPosition(): void {
        if (!this.containerXPosition && this.containerRef.nativeElement.offsetWidth) {
            setTimeout(() => {
                this.containerXPosition = this.containerRef.nativeElement.getBoundingClientRect().x
                    + this.containerRef.nativeElement.offsetWidth;
            });
        }
    }

    private bindContainerYPosition(): void {
        if (!this.containerYPosition && this.containerRef?.nativeElement.offsetHeight) {
            setTimeout(() => {
                this.containerYPosition = this.containerRef?.nativeElement.getBoundingClientRect().y
                    + this.containerRef?.nativeElement.offsetHeight;
            });
        }
    }

    private watchHover(host: any, container: any): void {
        const interval = setInterval(() => {
            if (!host || !container || !this.isInHover(host, container)) {
                this.isOpen = false;
                clearInterval(interval);
            }
        }, 1000);
    }

    private isInHover(host: any, container: any): boolean {
        return host.parentElement.querySelector(':hover') == host ||
            container.parentElement.querySelector(':hover') == container;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtDropdownOpenMethod {
    CLICK = 'CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}
