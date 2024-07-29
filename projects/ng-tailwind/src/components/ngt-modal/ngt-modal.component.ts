import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    Optional,
    Output,
    Self,
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
    ]
})
export class NgtModalComponent implements AfterViewInit {
    @Input() public customLayout: boolean = false;
    @Input() public disableDefaultCloses: boolean = false;
    @Input() public isDisabled: boolean;
    @Input() public ngtStyle: NgtStylizableService;

    @Output() public onCloseModal: EventEmitter<void> = new EventEmitter();
    @Output() public onOpenModal: EventEmitter<void> = new EventEmitter();

    public isOpen: boolean = false;
    public viewMode: boolean = false;

    private keydownEventWasAdded: boolean = false;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private injector: Injector,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
    ) {
        if (this.tailStylizableDirective) {
            this.ngtStyle = this.tailStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtModal', {
            w: 'md:max-w-md',
            py: 'py-4',
            px: 'px-6',
            border: 'border border-teal-500',
            overflow: 'overflow-visible',
            color: {}
        });
    }

    public async ngAfterViewInit(): Promise<void> {
        if (this.isDisabled === undefined && this.ngtAbilityValidationService) {
            this.isDisabled = !(await this.ngtAbilityValidationService.hasManagePermission());

            this.changeDetectorRef.detectChanges();
        }
    }

    public close() {
        this.isOpen = false;
        this.changeDetectorRef.detectChanges();

        this.destroySubscriptions();

        this.onCloseModal.emit();
    }

    public open() {
        this.isOpen = true;
        this.changeDetectorRef.detectChanges();

        this.addKeydownEventListener();
        this.bindOnCloseModalByHeaderSubscription();

        this.onOpenModal.emit();
    }

    private addKeydownEventListener() {
        if (!this.disableDefaultCloses && !this.keydownEventWasAdded) {
            this.keydownEventWasAdded = true;

            window.addEventListener('keydown', (event: any) => {
                if (event.keyCode == 27) {
                    if (this.viewMode) {
                        this.closeViewMode();
                        event.stopPropagation();
                    }
                }
            }, true);
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
        this.viewMode = false;
    }
}
