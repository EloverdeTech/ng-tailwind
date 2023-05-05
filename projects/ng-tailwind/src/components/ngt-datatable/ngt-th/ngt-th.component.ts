import {
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Output,
    Self,
    SimpleChanges,
    SkipSelf,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtInputComponent } from '../../ngt-input/ngt-input.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-th]',
    templateUrl: './ngt-th.component.html'
})
export class NgtThComponent implements OnChanges, OnDestroy {
    @ViewChild('searchInput') public searchInput: NgtInputComponent;
    @ViewChild('modal', { static: true }) public modal: TemplateRef<any>;

    @Input() public reference: string;
    @Input() public sortReference: string;
    @Input() public modalWidth: string = 'md:max-w-md';
    @Input() public sortable: boolean;
    @Input() public searchable: boolean;
    @Input() public hasCustomSearch: boolean = false;
    @Input() public searchLabel: string;
    @Input() public sortableTooltip: NgtSortableTooltip = {
        ascending: 'Ordenar de Z a A',
        descending: 'Limpar ordenação',
        unordered: 'Ordenar de A a Z'
    };

    @Output() public onEnableSearch = new EventEmitter();

    public inputFocused: boolean = false;
    public isCurrentSort = false;
    public sortDirection = '';
    public searchTerm: any;
    public customSearchTerm: any;
    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        public ngtDataTable: NgtDatatableComponent
    ) {
        if (this.checkDataTable()) {
            this.subscriptions.push(
                this.ngtDataTable.onDataChange.subscribe(() => {
                    this.isCurrentSort = this.ngtDataTable.getCurrentSort().field == this.getSortReference();

                    if (this.isCurrentSort) {
                        this.sortDirection = this.ngtDataTable.getCurrentSort().direction;
                    }
                })
            );

            this.subscriptions.push(
                this.ngtDataTable.onClearFilter.subscribe((reference) => {
                    if (reference == this.reference || !reference) {
                        this.searchTerm = '';
                        this.customSearchTerm = null;
                    }
                })
            );
        }

        this.bindNgtStyle();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.searchLabel && this.checkDataTable) {
            this.ngtDataTable.setFilterDescription(this.reference, this.searchLabel);
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public async sort() {
        if (this.sortable && this.checkDataTable() && this.checkReference()) {
            let sortDirection = this.getNextSortDirection();

            if (sortDirection) {
                await this.ngtDataTable.sort(this.getSortReference(), sortDirection);
            } else {
                this.ngtDataTable.sort('', '');
            }

            this.sortDirection = sortDirection;
        }
    }

    public enableSearch(event: any) {
        event.stopPropagation();

        this.ngtDataTable.searchModal.ngtStyle.w = this.modalWidth;
        this.ngtDataTable.setSearchModalTemplate(this.modal);
        this.ngtDataTable.openSearchModal(this.reference);

        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.setFocus();
            }
        }, 100);

        this.onEnableSearch.emit();
    }

    public search(term: any) {
        if (!this.hasCustomSearch && this.searchTerm === undefined
            && this.customSearchTerm === undefined && !term) {
            return;
        }

        if (this.searchable && this.reference) {
            let filter = {};

            filter[this.reference] = term;
            this.ngtDataTable.search(filter);
        }
    }

    public customSearch(term: any) {
        this.customSearchTerm = term;
    }

    public getTooltip() {
        if (this.sortable && this.sortableTooltip) {
            if (this.sortDirection == 'asc') {
                return this.sortableTooltip.ascending;
            } else if (this.sortDirection == 'desc') {
                return this.sortableTooltip.descending;
            }

            return this.sortableTooltip.unordered;
        }

        return '';
    }

    private getSortReference() {
        return this.sortReference ? this.sortReference : this.reference;
    }

    private checkDataTable() {
        if (!this.ngtDataTable) {
            console.error('The [ngt-th] must be inside of a [ngt-datatable]');

            return false;
        }

        return true;
    }

    private checkReference() {
        if (!this.reference && !this.sortReference) {
            console.error('The [ngt-th] must have a [reference] or a [sortReference] property to be able to sort');

            return false;
        }

        return true;
    }

    private getNextSortDirection() {
        switch (this.sortDirection) {
            case 'asc': return 'desc';
            case 'desc': return '';
            case '': return 'asc';
        }
    }

    private bindNgtStyle() {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

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
