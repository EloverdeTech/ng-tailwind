import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Self,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';

@Component({
    selector: 'ngt-button',
    templateUrl: './ngt-button.component.html',
    styleUrls: ['./ngt-button.component.css']
})
export class NgtButtonComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() public href: string;
    @Input() public type: string = 'success';
    @Input() public link: boolean;
    @Input() public loading: boolean;
    @Input() public isDisabled: boolean;
    @Input() public forceEnable: boolean;
    @Input() public noSubmit: boolean;

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private changeDetector: ChangeDetectorRef,
        private injector: Injector,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtButton', {
            px: 'px-2',
            py: 'py-1',
            text: 'text-xs',
            font: 'font-normal',
            w:  'w-full',
            h: 'h-full',
        });
    }

    public onClick(event: Event): void {
        if (this.disabled() || this.loading) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public ngAfterViewInit(): void {
        this.bindSubscriptions();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.type) {
            if (changes.type.currentValue == 'success') {
                this.ngtStyle.load(this.injector, 'NgtSuccessButton', {
                    color: {
                        bg: 'bg-green-500',
                        text: 'text-white text-xs',
                    }
                });
            } else if (changes.type.currentValue == 'warning') {
                this.ngtStyle.load(this.injector, 'NgtWarningButton', {
                    color: {
                        bg: 'bg-orange-500',
                        text: 'text-white text-xs',
                    }
                });
            } else if (changes.type.currentValue == 'danger') {
                this.ngtStyle.load(this.injector, 'NgtDangerButton', {
                    color: {
                        bg: 'bg-red-500',
                        text: 'text-white text-xs',
                    }
                });
            } else {
                this.ngtStyle.load(this.injector, 'NgtInfoButton', {
                    color: {
                        bg: 'bg-blue-500',
                        text: 'text-white text-xs',
                    }
                });
            }
        }
    }

    public disabled(): boolean {
        return !this.forceEnable && (this.isDisabled || this.isDisabledByParent());
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    private bindSubscriptions(): void {
        if (this.ngtForm) {
            this.loading = this.ngtForm.isLoading();

            this.changeDetector.detectChanges();

            this.subscriptions.push(
                this.ngtForm.onLoadingChange.subscribe((loading: boolean) => {
                    this.loading = loading;
                })
            );
        }
    }

    private isDisabledByParent(): boolean {
        return this.ngtForm?.isDisabled
            || this.ngtSection?.isDisabled
            || this.ngtModal?.isDisabled;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
