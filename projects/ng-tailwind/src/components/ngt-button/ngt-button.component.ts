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

@Component({
    selector: 'ngt-button',
    templateUrl: './ngt-button.component.html',
    styleUrls: ['./ngt-button.component.css'],
})
export class NgtButtonComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() public link: boolean = false;
    @Input() public href: string;
    @Input() public type: string = 'success';
    @Input() public loading: boolean = false;
    @Input() public isDisabled: boolean = false;
    @Input() public noSubmit: boolean = false;

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private changeDetector: ChangeDetectorRef,
        private injector: Injector,
        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtButton', {
            px: 'px-4',
            py: 'py-2'
        });
    }

    public onClick(event: Event) {
        if (this.isDisabled || this.loading) {
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
                        text: 'text-white text-sm',
                    }
                });
            } else if (changes.type.currentValue == 'warning') {
                this.ngtStyle.load(this.injector, 'NgtWarningButton', {
                    color: {
                        bg: 'bg-orange-500',
                        text: 'text-white text-sm',
                    }
                });
            } else if (changes.type.currentValue == 'danger') {
                this.ngtStyle.load(this.injector, 'NgtDangerButton', {
                    color: {
                        bg: 'bg-red-500',
                        text: 'text-white text-sm',
                    }
                });
            } else {
                this.ngtStyle.load(this.injector, 'NgtInfoButton', {
                    color: {
                        bg: 'bg-blue-500',
                        text: 'text-white text-sm',
                    }
                });
            }
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    private bindSubscriptions(): void {
        this.changeDetector.detectChanges();

        if (this.ngtForm) {
            this.loading = this.ngtForm.isLoading();
            this.isDisabled = !this.isDisabled && this.ngtForm.isDisabled;

            this.changeDetector.detectChanges();

            this.subscriptions.push(
                this.ngtForm.onLoadingChange.subscribe((loading: boolean) => {
                    this.loading = loading;
                })
            );

            this.subscriptions.push(
                this.ngtForm.onIsDisabledChange.subscribe((isDisabled: boolean) => {
                    this.isDisabled = !this.isDisabled && isDisabled;
                })
            );
        }
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
