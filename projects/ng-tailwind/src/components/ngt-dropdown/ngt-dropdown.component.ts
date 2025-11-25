import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    input,
    OnDestroy,
    Optional,
    output,
    Signal,
    signal,
    SkipSelf,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { uuid } from '../../helpers/uuid';
import { NgtDropdownContainerComponent } from './ngt-dropdown-container/ngt-dropdown-container.component';

export enum NgtDropdownOpenMethod {
    CLICK = 'CLICK',
    POPOVER_CLICK = 'POPOVER_CLICK',
    RIGHT_CLICK = 'RIGHT_CLICK',
    HOVER = 'HOVER'
}

@Component({
    selector: 'ngt-dropdown',
    templateUrl: './ngt-dropdown.component.html',
    styleUrls: ['./ngt-dropdown.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    animations: [
        trigger('openClose', [
            state('open', style({ opacity: 1, transform: 'translateY(0px)' })),
            state('closed', style({ opacity: 0, transform: 'translateY(-10px)' })),
            transition('closed => open', [
                animate(300)
            ]),
        ]),
    ],
})
export class NgtDropdownComponent implements OnDestroy {
    @ViewChild('container', { static: true }) public containerRef: ElementRef;

    /** Visual Inputs */

    public readonly scrollable = input<boolean>(false);
    public readonly autoXReverse = input<boolean>(false);
    public readonly autoYReverse = input<boolean>(true);
    public readonly reverseXPosition = input<boolean>();
    public readonly reverseYPosition = input<boolean>();

    /** Behavior Inputs */

    public readonly closeOnClick = input<boolean>(false);
    public readonly closeTimeout = input<number>(1000);
    public readonly openMethod = input<NgtDropdownOpenMethod>(NgtDropdownOpenMethod.HOVER);

    /** Outputs */

    public readonly onToggle = output<boolean>();
    public readonly onHostClick = output<any>();

    /** Computed Signals */

    public readonly shouldReverseXPosition: Signal<boolean> = computed(() =>
        this.getShouldReverseXPosition()
    );

    public readonly shouldReverseYPosition: Signal<boolean> = computed(() =>
        this.getShouldReverseYPosition()
    );

    public readonly isClickMethod: Signal<boolean> = computed(() =>
        this.openMethod() == NgtDropdownOpenMethod.CLICK
        || this.openMethod() == NgtDropdownOpenMethod.POPOVER_CLICK
    );

    public readonly isHoverMethod: Signal<boolean> = computed(() =>
        this.openMethod() == NgtDropdownOpenMethod.HOVER
    );

    public readonly isRightClickMethod: Signal<boolean> = computed(() =>
        this.openMethod() == NgtDropdownOpenMethod.RIGHT_CLICK
    );

    public readonly isPopoverClickMethod: Signal<boolean> = computed(() =>
        this.openMethod() == NgtDropdownOpenMethod.POPOVER_CLICK
    );

    /** Internal Signals */

    public readonly uuid: string = uuid();
    public readonly isOpen: WritableSignal<boolean> = signal(false);
    public readonly isYPositionReversed: WritableSignal<boolean> = signal(false);
    public readonly isXPositionReversed: WritableSignal<boolean> = signal(false);
    public readonly isBindingContainerYPosition: WritableSignal<boolean> = signal(true);
    public readonly isBindingContainerXPosition: WritableSignal<boolean> = signal(true);

    private readonly containerXPosition: WritableSignal<number | null> = signal(null);
    private readonly containerYPosition: WritableSignal<number | null> = signal(null);

    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @SkipSelf()
        private ngtDropdownContainer: NgtDropdownContainerComponent,

        private changeDetector: ChangeDetectorRef,
    ) {
        this.registerEffects();

        this.bindSubscriptions();
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public open(): void {
        this.isOpen.set(true);
        this.ngtDropdownContainer?.setActiveDropdown(this);

        this.changeDetector.detectChanges();

        this.bindContainerXPosition();
        this.bindContainerYPosition();

        this.onToggle.emit(this.isOpen());
    }

    public closeOnSelectOption(): void {
        if (this.closeOnClick()) {
            this.close();
        }
    }

    public close(): void {
        this.isOpen.set(false);
        this.containerXPosition.set(null);
        this.containerYPosition.set(null);

        this.onToggle.emit(this.isOpen());
    }

    public toggle(): void {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    public onHover(host: any, container: any): void {
        if (this.isHoverMethod() && host && container) {
            this.open();
            this.watchHover(host, container);
        }
    }

    public onClick(event: Event, host: any, container: any): void {
        this.onHostClick.emit(event);

        if (this.isClickMethod()) {
            event.preventDefault();
            event.stopPropagation();

            this.toggle();
        }

        if (this.isPopoverClickMethod()) {
            this.watchHover(host, container);
        }
    }

    public onRightClick(event: Event): void {
        if (this.isRightClickMethod()) {
            event.preventDefault();
            event.stopPropagation();

            this.toggle();
        }
    }

    private registerEffects(): void {
        effect(() => {
            if (this.isOpen() && !this.isBindingContainerXPosition()) {
                const containerX = this.containerXPosition();

                if (containerX !== null) {
                    this.isXPositionReversed.set(!(containerX > document.documentElement.clientWidth));
                }
            }
        });

        effect(() => {
            if (this.isOpen() && !this.isBindingContainerYPosition()) {
                const containerY = this.containerYPosition();

                if (containerY !== null) {
                    this.isYPositionReversed.set(containerY > (document.documentElement.clientHeight * 0.9));
                }
            }
        });
    }

    private bindSubscriptions(): void {
        if (this.ngtDropdownContainer) {
            this.subscriptions.push(
                toObservable(this.ngtDropdownContainer.activeDropdown)
                    .subscribe((activeDropdown: NgtDropdownComponent | null) => {
                        this.isOpen.set(activeDropdown?.uuid === this.uuid);
                    })
            );
        }
    }

    private bindContainerXPosition(): void {
        if (!this.containerXPosition() && this.containerRef.nativeElement.offsetWidth) {
            this.isBindingContainerXPosition.set(true);

            const position = this.containerRef.nativeElement.getBoundingClientRect().x
                + this.containerRef.nativeElement.offsetWidth;

            this.containerXPosition.set(position);
            this.isBindingContainerXPosition.set(false);
        }
    }

    private bindContainerYPosition(): void {
        if (!this.containerYPosition() && this.containerRef?.nativeElement.offsetHeight) {
            this.isBindingContainerYPosition.set(true);

            const position = this.containerRef.nativeElement.getBoundingClientRect().y
                + this.containerRef.nativeElement.offsetHeight;

            this.containerYPosition.set(position);
            this.isBindingContainerYPosition.set(false);
        }
    }

    private watchHover(host: any, container: any): void {
        const interval = setInterval(() => {
            if (!host || !container || !this.isInHover(host, container)) {
                this.close();

                clearInterval(interval);
            }
        }, this.closeTimeout());
    }

    private getShouldReverseXPosition(): boolean {
        if (!this.autoXReverse() || this.reverseXPosition() !== undefined) {
            return this.reverseXPosition();
        }

        if (this.isOpen() && !this.isBindingContainerXPosition()) {
            return this.isXPositionReversed();
        }

        return false;
    }

    private getShouldReverseYPosition(): boolean {
        if (!this.autoYReverse() || this.reverseYPosition() !== undefined) {
            return this.reverseYPosition();
        }

        if (this.isOpen() && !this.isBindingContainerYPosition()) {
            return this.isYPositionReversed();
        }

        return false;
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
