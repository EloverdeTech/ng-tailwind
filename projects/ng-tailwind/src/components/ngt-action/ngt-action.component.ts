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
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';

@Component({
    selector: 'ngt-action',
    templateUrl: './ngt-action.component.html'
})
export class NgtActionComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() public href: string;
    @Input() public icon: string;
    @Input() public ngtStyle: NgtStylizableService;
    @Input() public isDisabled: boolean;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        private changeDetector: ChangeDetectorRef,
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        public ngtForm: NgtFormComponent,
        @Optional() @SkipSelf()
        public ngtSection: NgtSectionComponent
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtAction', {
            h: 'h-full',
            w: 'w-full',
            color: {
                bg: 'bg-gray-500',
                text: 'text-white',
                border: '',
            },
            text: 'text-xl',
            border: 'border-0',
        });
    }

    public ngAfterViewInit(): void {
        this.bindSubscriptions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isDisabled && !changes.isDisabled.currentValue) {
            this.isDisabled = this.ngtForm?.isDisabled || this.ngtSection?.isDisabled;
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public onClick(event: Event) {
        if (this.isDisabled) {
            event.stopPropagation();
        }
    }

    private bindSubscriptions(): void {
        this.changeDetector.detectChanges();

        if (!this.isDisabled) {
            this.isDisabled = this.ngtForm?.isDisabled || this.ngtSection?.isDisabled;
        }

        if (this.ngtForm) {
            this.subscriptions.push(
                this.ngtForm.onIsDisabledChange.subscribe((isDisabled: boolean) => {
                    if (!this.isDisabled) {
                        this.isDisabled = isDisabled || this.ngtSection?.isDisabled;
                    }
                })
            );
        }

        if (this.ngtSection) {
            this.subscriptions.push(
                this.ngtSection.onIsDisabledChange.subscribe((isDisabled: boolean) => {
                    if (!this.isDisabled) {
                        this.isDisabled = isDisabled || this.ngtForm?.isDisabled;
                    }
                })
            );
        }

        this.changeDetector.detectChanges();
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
