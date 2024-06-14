import { AfterContentInit, Component, ElementRef, Injector, OnDestroy, Optional, Self, SkipSelf, ViewChild } from '@angular/core';
import { NgtTranslateService } from '../../../services/http/ngt-translate.service';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtCheckboxComponent } from '../../ngt-checkbox/ngt-checkbox.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-th-check]',
    templateUrl: './ngt-th-check.component.html'
})
export class NgtThCheckComponent implements AfterContentInit, OnDestroy {
    @ViewChild(NgtCheckboxComponent) public ngtCheckbox: NgtCheckboxComponent;

    public checked = false;
    public ngtStyle: NgtStylizableService;
    public hasSelectedAllCheckboxes: boolean;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtDataTable: NgtDatatableComponent,

        @Optional()
        public ngtTranslateService: NgtTranslateService,
    ) {
        this.bindNgtStyle();

        if (this.hasSelectedAllElements()) {
            this.checked = true;
            this.hasSelectedAllCheckboxes = true;
        }
    }

    public getSelectAllElementsCheckboxStyle(): string {
        return this.hasSelectedAllElements()
            ? `${this.ngtCheckbox?.ngtStyle.compile(['color.bg'])} text-white`
            : `hover:${this.ngtCheckbox?.ngtStyle.compile(['color.bg'])} hover:text-white bg-white`;
    }

    public hasSelectedAllElements(): boolean {
        return this.ngtDataTable?.hasSelectedAllElements;
    }

    public canSelectAllFilter(): boolean {
        return this.ngtDataTable?.canSelectAllRegisters;
    }

    public getPaginationTotal(): number {
        return this.ngtDataTable?.ngtPagination?.getPagination()?.total;
    }

    public onToggleSelectAllElements(): void {
        this.ngtDataTable?.onSelectAllRegisters.emit();
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
            this.hasSelectedAllCheckboxes = checked;

            if (!checked && this.hasSelectedAllElements()) {
                this.ngtDataTable?.onSelectAllRegisters.emit();
            }
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
