import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    Optional,
    OutputRefSubscription,
    Self,
    SkipSelf,
    ViewChild,
    signal,
    WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtCheckboxComponent } from '../../forms/template-driven/ngt-checkbox/ngt-checkbox.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-th-check]',
    templateUrl: './ngt-th-check.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtThCheckComponent implements AfterContentInit, OnDestroy {
    @ViewChild(NgtCheckboxComponent) public ngtCheckbox: NgtCheckboxComponent;

    public ngtStyle: NgtStylizableService;

    public readonly checkedState: WritableSignal<boolean> = signal(false);
    public readonly hasSelectedAllCheckboxesState: WritableSignal<boolean> = signal(false);

    private subscriptions: Array<Subscription | OutputRefSubscription> = [];

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
        this.setupNgtStylizable();

        if (this.hasSelectedAllElements()) {
            this.checkedState.set(true);
            this.hasSelectedAllCheckboxesState.set(true);
        }
    }

    public get checked(): boolean {
        return this.checkedState();
    }

    public get hasSelectedAllCheckboxes(): boolean {
        return this.hasSelectedAllCheckboxesState();
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
        return this.ngtDataTable?.canSelectAllRegisters();
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
                    this.checkedState.set(false);
                })
            );

            this.subscriptions.push(
                this.ngtDataTable.onClearSelectedElements.subscribe(() => {
                    this.checkedState.set(false);
                })
            );
        }
    }

    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    public onCheckboxChange(checked: boolean) {
        if (this.ngtDataTable) {
            this.ngtDataTable.onToogleAllCheckboxes.emit(checked);
            this.hasSelectedAllCheckboxesState.set(checked);
            this.checkedState.set(checked);

            if (!checked && this.hasSelectedAllElements()) {
                this.hasSelectedAllCheckboxesState.set(true);
                this.checkedState.set(true);
            }
        }
    }

    private setupNgtStylizable() {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

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
}
