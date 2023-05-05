import { AfterContentInit, Component, ElementRef, Injector, OnDestroy, Optional, Self, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-th-check]',
    templateUrl: './ngt-th-check.component.html'
})
export class NgtThCheckComponent implements AfterContentInit, OnDestroy {
    public checked = false;
    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        private ngtDataTable: NgtDatatableComponent
    ) {
        this.bindNgtStyle();
    }

    public ngAfterContentInit() {
        if (this.ngtDataTable) {
            this.subscriptions.push(
                this.ngtDataTable.onDataChange.subscribe(() => {
                    this.checked = false;
                })
            );

            this.subscriptions.push(
                this.ngtDataTable.onClearSelectedElements.subscribe(() => {
                    this.checked = false;
                })
            );
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public onCheckboxChange(checked: boolean) {
        if (this.ngtDataTable) {
            this.ngtDataTable.onToogleAllCheckboxes.emit(checked);
        }
    }

    private bindNgtStyle() {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtThCheck', {
            py: 'py-4',
            px: 'px-6',
            text: 'text-center',
            border: 'border-b',
            color: {
                border: '',
                bg: 'bg-gray-500',
                text: 'text-white'
            }
        });

        this.hostElement.nativeElement.classList += this.ngtStyle.compile([
            'h',
            'px',
            'py',
            'pb',
            'pl',
            'pr',
            'pt',
            'mb',
            'ml',
            'mr',
            'mt',
            'border',
            'color.border',
            'color.bg',
            'color.text'
        ]);
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
