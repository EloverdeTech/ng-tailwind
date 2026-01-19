import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    Injector,
    input,
    NgZone,
    Optional,
    output,
    Self,
    signal,
    WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtModalHeaderComponent } from './ngt-modal-header/ngt-modal-header.component';
import { NgtAbilityValidationService } from '../../services/validation/ngt-ability-validation.service';

@Component({
    selector: 'ngt-modal',
    templateUrl: './ngt-modal.component.html',
    animations: [
        trigger('fade', [
            state('void', style({ opacity: 0 })),
            transition(':enter, :leave', [
                animate(300)
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtModalComponent implements AfterViewInit {
    /** Inputs */

    public readonly customLayout = input<boolean>(false);
    public readonly disableDefaultCloses = input<boolean>(false);
    public readonly ngtStyle = input<NgtStylizableService>();

    /** Outputs */

    public readonly onCloseModal = output<void>();
    public readonly onOpenModal = output<void>();

    /** Signals */

    public readonly isDisabled = input<boolean>();
    public readonly isDisabledState = computed(() => this.isDisabled() || this.internalDisabledState());
    public readonly isOpenSignal: WritableSignal<boolean> = signal(false);
    public readonly viewMode: WritableSignal<boolean> = signal(false);

    public readonly resolvedStyle = computed(
        () => this.ngtStyle() ?? this.localStyle
    );

    /** Internal */

    private readonly internalDisabledState: WritableSignal<boolean> = signal(false);
    private localStyle: NgtStylizableService;
    private keydownEventWasAdded: boolean = false;
    private keydownListener: (event: KeyboardEvent) => void;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        private zone: NgZone,
        private injector: Injector,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
    ) {
        this.setupNgtStylizable();
    }

    public get isOpen(): boolean {
        return this.isOpenSignal();
    }

    public async ngAfterViewInit(): Promise<void> {
        if (this.isDisabled() === undefined && this.ngtAbilityValidationService) {
            this.internalDisabledState.set(
                !(await this.ngtAbilityValidationService.hasManagePermission())
            );
        }
    }

    public close() {
        this.isOpenSignal.set(false);

        this.removeKeydownEventListener();
        this.destroySubscriptions();

        this.onCloseModal.emit();
    }

    public open() {
        this.isOpenSignal.set(true);

        this.addKeydownEventListener();
        this.bindOnCloseModalByHeaderSubscription();

        this.onOpenModal.emit();
    }

    private addKeydownEventListener() {
        if (!this.disableDefaultCloses() && !this.keydownEventWasAdded) {
            this.keydownEventWasAdded = true;

            this.zone.runOutsideAngular(() => {
                this.keydownListener = (event: KeyboardEvent) => {
                    if ((event as any).keyCode == 27) {
                        if (this.viewMode()) {
                            this.zone.run(() => {
                                this.closeViewMode();
                            });
                            event.stopPropagation();
                        }
                    }
                };

                window.addEventListener('keydown', this.keydownListener, true);
            });
        }
    }

    private removeKeydownEventListener(): void {
        if (this.keydownListener) {
            window.removeEventListener('keydown', this.keydownListener, true);
            this.keydownListener = null;
            this.keydownEventWasAdded = false;
        }
    }

    private bindOnCloseModalByHeaderSubscription(): void {
        this.subscriptions.push(
            NgtModalHeaderComponent.onCloseModalByHeader.subscribe(() => this.close())
        );
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());

        this.subscriptions = [];
    }

    private closeViewMode(): void {
        this.viewMode.set(false);
    }

    private setupNgtStylizable(): void {
        this.localStyle = this.tailStylizableDirective
            ? this.tailStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.localStyle.load(this.injector, 'NgtModal', {
            w: 'md:max-w-md',
            py: 'py-4',
            px: 'px-6',
            border: 'border border-teal-500',
            overflow: 'overflow-visible',
            color: {}
        });
    }
}
