import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    Optional,
    OutputRefSubscription,
    Self,
    SkipSelf,
    TemplateRef,
    ViewChild,
    effect,
    input,
    output,
    signal,
    WritableSignal,
} from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtInputComponent } from '../../forms/template-driven/ngt-input/ngt-input.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-th]',
    templateUrl: './ngt-th.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtThComponent implements OnDestroy {
    @ViewChild('searchInput') public searchInput: NgtInputComponent;
    @ViewChild('modal', { static: true }) public modal: TemplateRef<any>;

    /** Inputs */

    public readonly reference = input<string>();
    public readonly sortReference = input<string>();
    public readonly modalWidth = input<string>('md:max-w-md');
    public readonly searchModalOverflow = input<string>('overflow-visible');
    public readonly sortable = input<boolean>(false);
    public readonly searchable = input<boolean>(false);
    public readonly hasCustomSearch = input<boolean>(false);
    public readonly searchLabel = input<string>();
    public readonly searchIcon = input<string>();
    public readonly sortableTooltip = input<NgtSortableTooltip>({
        ascending: 'Ordenar de Z a A',
        descending: 'Limpar ordenação',
        unordered: 'Ordenar de A a Z'
    });

    /** Outputs */

    public readonly onEnableSearch = output<void>();

    /** Signals */

    public readonly isCurrentSort: WritableSignal<boolean> = signal(false);
    public readonly sortDirection: WritableSignal<string> = signal('');
    public readonly searchTerm: WritableSignal<any> = signal(null);
    public readonly customSearchTerm: WritableSignal<any> = signal(null);

    /** Other */

    public ngtStyle: NgtStylizableService;
    public filterModalHeaderStyle: NgtStylizableService = new NgtStylizableService();
    public filterModalBodyStyle: NgtStylizableService = new NgtStylizableService();

    private subscriptions: Array<OutputRefSubscription> = [];

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        public ngtDataTable: NgtDatatableComponent
    ) {
        this.setupNgtStylizable();
        this.bindSubscriptions();

        effect(() => {
            const label = this.searchLabel();

            if (label && this.checkDataTable()) {
                this.ngtDataTable.setFilterDescription(this.reference(), label);
            }
        });
    }

    public async sort() {
        if (this.sortable() && this.checkDataTable() && this.checkReference()) {
            const nextSortDirection = this.getNextSortDirection();

            if (nextSortDirection) {
                await this.ngtDataTable.sort(this.getSortReference(), nextSortDirection);
            } else {
                this.ngtDataTable.sort('', '');
            }

            this.sortDirection.set(nextSortDirection);
        }
    }

    public enableSearch(event: Event) {
        event.stopPropagation();

        this.ngtDataTable.searchModal.ngtStyle().w = this.modalWidth();
        this.ngtDataTable.searchModal.ngtStyle().overflow = this.searchModalOverflow();

        this.ngtDataTable.setSearchModalTemplate(this.modal);
        this.ngtDataTable.openSearchModal(this.reference());

        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.setFocus();
            }
        }, 100);

        this.onEnableSearch.emit();
    }

    public onSearchTermChange(term: any) {
        this.searchTerm.set(term);
        this.search(term);
    }

    public search(term: any) {
        if (!this.hasCustomSearch() && this.searchTerm() === undefined
            && this.customSearchTerm() === undefined && !term) {
            return;
        }

        if (this.searchable() && this.reference()) {
            const filter = {};

            filter[this.reference()] = term;
            this.ngtDataTable.search(filter);
        }
    }

    public customSearch(term: any) {
        this.customSearchTerm.set(term);
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public getTooltip() {
        if (this.sortable() && this.sortableTooltip()) {
            if (this.sortDirection() == 'asc') {
                return this.sortableTooltip().ascending;
            } else if (this.sortDirection() == 'desc') {
                return this.sortableTooltip().descending;
            }

            return this.sortableTooltip().unordered;
        }

        return '';
    }

    private getSortReference() {
        return this.sortReference() ? this.sortReference() : this.reference();
    }

    private checkDataTable() {
        if (!this.ngtDataTable) {
            console.error('The [ngt-th] must be inside of a [ngt-datatable]');

            return false;
        }

        return true;
    }

    private checkReference() {
        if (!this.reference() && !this.sortReference()) {
            console.error('The [ngt-th] must have a [reference] or a [sortReference] property to be able to sort');

            return false;
        }

        return true;
    }

    private getNextSortDirection() {
        switch (this.sortDirection()) {
            case 'asc': return 'desc';
            case 'desc': return '';
            case '': return 'asc';
        }
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtTh', {
            py: 'py-4',
            px: 'px-6',
            font: 'font-bold',
            text: 'text-sm',
            border: 'border-b',
            justifyContent: 'justify-center',
            color: {
                bg: '',
                text: '',
                border: ''
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
            'color.bg',
            'color.text',
            'color.border',
            'text',
            'font',
        ]);

        this.filterModalHeaderStyle.load(this.injector, 'FilterModalHeader', {
            pb: 'pb-3',
            color: {}
        });

        this.filterModalBodyStyle.load(this.injector, 'FilterModalBody', {
            px: 'px-0',
            py: 'py-0'
        });
    }

    private bindSubscriptions(): void {
        if (this.checkDataTable()) {
            this.subscriptions.push(
                this.ngtDataTable.onDataChange.subscribe(() => {
                    const currentSort = this.ngtDataTable.getCurrentSort();

                    this.isCurrentSort.set(currentSort.field == this.getSortReference());

                    if (this.isCurrentSort()) {
                        this.sortDirection.set(currentSort.direction);
                    }
                })
            );

            this.subscriptions.push(
                this.ngtDataTable.onClearFilter.subscribe((reference) => {
                    if (reference == this.reference() || !reference) {
                        this.searchTerm.set('');
                        this.customSearchTerm.set(null);
                    }
                })
            );
        }
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export interface NgtSortableTooltip {
    ascending: string;
    descending: string;
    unordered: string;
}
