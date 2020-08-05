import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtInputComponent } from '../ngt-input/ngt-input.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtPaginationComponent } from '../ngt-pagination/ngt-pagination.component';

@Component({
    selector: 'ngt-datatable',
    templateUrl: './ngt-datatable.component.html',
    styleUrls: ['./ngt-datatable.component.css']
})
export class NgtDatatableComponent implements OnInit {
    @ViewChild('table', { static: true }) public table: ElementRef;
    @ViewChild('ngtPagination', { static: true }) public ngtPagination: NgtPaginationComponent;
    @ViewChild('searchModal', { static: true }) public searchModal: NgtModalComponent;

    @Input() public remoteResource: any;
    @Input() public type: NgtDatatableType = NgtDatatableType.REMOTE;
    @Input() public filterTagBgColor: string = 'bg-blue-500';
    @Input() public inputSearch: NgtInputComponent;
    @Input() public defaultFilters: any = {};
    @Input() public filtersDescription = {
        reference: name
    };

    @Output() public onDataChange: EventEmitter<any> = new EventEmitter();
    @Output() public onClearFilter: EventEmitter<any> = new EventEmitter();
    @Output() public onClearSelectedElements: EventEmitter<any> = new EventEmitter();
    @Output() public onToogleAllCheckboxes: EventEmitter<any> = new EventEmitter();
    @Output() public onToogleCheckbox: EventEmitter<NgtCheckedElement> = new EventEmitter();

    public searchModalTemplate: TemplateRef<any>;
    public data = [];
    public loading = false;
    public cleaningFilter = false;
    public componentReady = false;
    public filtersTranslated = [];
    public emptyStateVisible: boolean;
    public columnCount = [];

    public selectedElements = [];
    private searchTimeout: any;
    private currentState = {
        filters: {
            defaultFilters: {},
            silentFilters: {},
        },
        sort: {
            field: '',
            direction: ''
        }
    };

    public constructor(
        private ngtHttpService: NgtHttpService,
        private changeDetector: ChangeDetectorRef
    ) { }

    public ngOnInit() {
        if (this.table && this.table.nativeElement && this.table.nativeElement.rows
            && this.table.nativeElement.rows[0] && this.table.nativeElement.rows[0].cells) {
            this.columnCount = this.table.nativeElement.rows[0].cells;
        }

        if (this.inputSearch) {
            this.initSearchWithInput();
        }

        this.initCheckboxEvent();
    }

    public setSearchModalTemplate(template: TemplateRef<any>) {
        this.searchModalTemplate = template;
    }

    public openSearchModal() {
        this.searchModal.open();
    }

    public clearSelectedElements() {
        this.selectedElements = [];
        this.onClearSelectedElements.emit();
    }

    public getCurrentState() {
        return this.currentState;
    }

    public init() {
        this.componentReady = true;
    }

    public async search(filters?: any, searchType: NgtDatatableSearchType = NgtDatatableSearchType.DEFAULT) {
        if (searchType == NgtDatatableSearchType.DEFAULT) {
            this.currentState.filters.defaultFilters = { ...this.currentState.filters.defaultFilters, ...filters };
        } else {
            this.currentState.filters.silentFilters = { ...this.currentState.filters.silentFilters, ...filters };
        }

        this.applyFiltersDescription();

        return this.apply(1);
    }

    public async sort(field: any, direction: any) {
        this.currentState.sort = {
            field: field,
            direction: direction
        };

        return this.apply(this.ngtPagination.getCurrentPage());
    }

    public async refresh() {
        return this.apply(this.ngtPagination.getCurrentPage());
    }

    public getData() {
        return this.data;
    }

    public getCurrentSort() {
        return this.currentState.sort;
    }

    public applyFiltersDescription() {
        if (!this.cleaningFilter) {
            this.filtersTranslated = [];

            for (let reference in this.currentState.filters.defaultFilters) {
                if (this.filtersDescription[reference] && this.currentState.filters.defaultFilters[reference]) {
                    this.filtersTranslated.push({
                        reference: reference,
                        value: this.currentState.filters.defaultFilters[reference],
                        translation: this.filtersDescription[reference]
                    });
                }
            }
        }
    }

    public setFilterDescription(reference: string, description: string) {
        this.filtersDescription[reference] = description;
    }

    public removeFilter(reference?: any) {
        this.cleaningFilter = true;

        if (!reference) {
            this.currentState.filters.defaultFilters = {};
            this.filtersTranslated = [];
        } else {
            delete this.currentState.filters.defaultFilters[reference];
            this.filtersTranslated = this.filtersTranslated.filter(element => element && element.reference !== reference);
        }

        this.onClearFilter.emit(reference);

        if (this.inputSearch && (reference === 'term' || !reference)) {
            this.inputSearch.clearInput();
        }

        this.apply(this.ngtPagination.getCurrentPage()).then(() => {
            this.cleaningFilter = false;
        });
    }

    public hasAppliedFilters(searchType: NgtDatatableSearchType = NgtDatatableSearchType.DEFAULT) {
        let appliedFilters = {};

        if (searchType == NgtDatatableSearchType.DEFAULT) {
            appliedFilters = this.currentState.filters.defaultFilters;
        } else if (searchType == NgtDatatableSearchType.SILENT) {
            appliedFilters = this.currentState.filters.silentFilters;
        } else {
            appliedFilters = { ...this.currentState.filters.defaultFilters, ...this.currentState.filters.silentFilters };
        }

        if (appliedFilters) {
            for (let reference in appliedFilters) {
                if (appliedFilters[reference]) {
                    return true;
                }
            }
        }

        return false;
    }

    public ngOnChanges(changes) {
        if (changes.inputSearch) {
            this.initSearchWithInput();
        }

        if (changes.type) {
            this.type = getEnumFromString(changes.type.currentValue, NgtDatatableType);
        }
    }

    public async apply(page = 1) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (!this.componentReady) {
            return;
        }

        this.data = [];
        this.selectedElements = [];

        if (this.type === NgtDatatableType.REMOTE) {
            if (this.remoteResource) {
                this.loading = true;
                this.bindVisibilityAttributes();

                this.searchTimeout = setTimeout(() => {
                    let pagination = { ...this.ngtPagination.getPagination(), ...{ page: page } };

                    this.ngtHttpService.get(
                        this.remoteResource, this.getQualifiedFilters(), pagination, this.currentState.sort
                    ).subscribe(
                        (response: NgtHttpResponse) => {
                            this.proccessRemoteResponse(response.data);
                            this.ngtPagination.proccessPagination(response.meta);
                            this.onDataChange.emit(this.data);
                            this.loading = false;
                            this.bindVisibilityAttributes();
                        },
                        (error) => {
                            console.error(error);
                            this.loading = false;
                        }
                    );
                }, 500);
            } else {
                console.error('The property [remoteResource] needs to be present to be able to make remote search');
            }
        } else if (this.type == NgtDatatableType.FIXED) {
            this.bindVisibilityAttributes();
        }
    }

    private getQualifiedFilters() {
        const qualifiedFilters = {};
        const requestedFilters = { ...this.currentState.filters.defaultFilters, ...this.currentState.filters.silentFilters };

        if (requestedFilters) {
            for (let reference in requestedFilters) {
                let filter = requestedFilters[reference];

                if (filter instanceof NgtCustomFilter) {
                    if (filter.tagLabel) {
                        this.filtersDescription[reference] = filter.tagLabel;
                        this.applyFiltersDescription();
                    }

                    qualifiedFilters[reference] = filter.term;
                } else {
                    qualifiedFilters[reference] = filter;
                }
            }
        }

        return qualifiedFilters;
    }

    private bindVisibilityAttributes() {
        this.changeDetector.detectChanges();

        if (this.type == NgtDatatableType.REMOTE && !this.data.length && !this.loading) {
            this.emptyStateVisible = true;
        } else if (this.type == NgtDatatableType.FIXED) {
            this.emptyStateVisible = false;
        } else {
            this.emptyStateVisible = false;
        }

        this.changeDetector.detectChanges();
    }

    private proccessRemoteResponse(response: any) {
        this.data = response;
    }

    private initSearchWithInput() {
        this.inputSearch.onValueChange().subscribe((value) => {
            this.search({ term: value });
        });
    }

    private initCheckboxEvent() {
        this.onToogleCheckbox.subscribe((checkedElement: NgtCheckedElement) => {
            this.selectedElements = this.selectedElements.filter(item => item.id !== checkedElement.id);

            if (checkedElement.checked) {
                this.selectedElements.push(checkedElement);
            }
        });
    }
}

export enum NgtDatatableType {
    REMOTE = 'REMOTE',
    FIXED = 'FIXED'
}

export enum NgtDatatableSearchType {
    DEFAULT = 'DEFAULT',
    SILENT = 'SILENT',
}

export class NgtCheckedElement {
    public id: string;
    public checked: boolean;
    public reference: any;
}

export class NgtCustomFilter {
    public term: string;
    public tagValue: string;
    public tagLabel?: string;
}
