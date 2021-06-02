import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtHttpPagination, NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtInputComponent } from '../ngt-input/ngt-input.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtPaginationComponent } from '../ngt-pagination/ngt-pagination.component';

@Component({
    selector: 'ngt-datatable',
    templateUrl: './ngt-datatable.component.html',
    styleUrls: ['./ngt-datatable.component.css']
})
export class NgtDatatableComponent implements OnInit, OnDestroy {
    @ViewChild('table', { static: true }) public table: ElementRef;
    @ViewChild('ngtPagination', { static: true }) public ngtPagination: NgtPaginationComponent;
    @ViewChild('searchModal', { static: true }) public searchModal: NgtModalComponent;

    @Input() public remoteResource: any;
    @Input() public type: NgtDatatableType = NgtDatatableType.REMOTE;
    @Input() public filterTagBgColor: string = 'bg-blue-500';
    @Input() public inputSearch: NgtInputComponent;
    @Input() public searchDelay: number = 500;
    @Input() public searchTermMinLength: number = 1;
    @Input() public searchTermOnEnter: boolean = true;
    @Input() public defaultFilters: any = {};
    @Input() public filtersDescription = {};

    @Output() public onDataChange: EventEmitter<any> = new EventEmitter();
    @Output() public onClearFilter: EventEmitter<any> = new EventEmitter();
    @Output() public onClearSelectedElements: EventEmitter<any> = new EventEmitter();
    @Output() public onSelectedElementsChange: EventEmitter<Array<NgtCheckedElement>> = new EventEmitter();
    @Output() public onToogleAllCheckboxes: EventEmitter<any> = new EventEmitter();
    @Output() public onToogleCheckbox: EventEmitter<NgtCheckedElement> = new EventEmitter();
    @Output() public onOpenSearchModal: EventEmitter<string> = new EventEmitter();
    @Output() public onSearch: EventEmitter<any> = new EventEmitter();

    public searchModalTemplate: TemplateRef<any>;
    public data = [];
    public loading = false;
    public cleaningFilter = false;
    public componentReady = false;
    public filtersTranslated = [];
    public emptyStateVisible: boolean;
    public columnCount = [];
    public selectedElements: Array<NgtCheckedElement> = [];

    private searchTimeout: any;
    private subscriptions: Array<Subscription> = [];
    private currentState = {
        filters: {
            defaultFilters: {},
            silentFilters: {},
            qualifiedFilters: {},
        },
        sort: {
            field: '',
            direction: ''
        }
    };

    public constructor(
        private injector: Injector,
        private ngtHttpService: NgtHttpService,
        private changeDetector: ChangeDetectorRef,
        @Optional()
        public ngtTranslateService: NgtTranslateService
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

        if (this.searchDelay == 500) {
            this.searchDelay = this.injector.get('NgtDatatableSearchDelay', 500);
        }

        if (this.searchTermMinLength == 1) {
            this.searchTermMinLength = this.injector.get('NgtDatatableSearchTermMinLength', 1);
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public setSearchModalTemplate(template: TemplateRef<any>) {
        this.searchModalTemplate = template;
    }

    public openSearchModal(reference?: string) {
        this.searchModal.open();
        this.onOpenSearchModal.emit(reference);
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

    public async search(filters?: any, searchType: NgtDatatableSearchType = NgtDatatableSearchType.DEFAULT, applyDelayOnSearch: boolean = true) {
        this.onSearch.emit(filters);

        if (searchType == NgtDatatableSearchType.DEFAULT) {
            this.currentState.filters.defaultFilters = { ...this.currentState.filters.defaultFilters, ...filters };
        } else {
            this.currentState.filters.silentFilters = { ...this.currentState.filters.silentFilters, ...filters };
        }

        this.applyFiltersDescription();

        return this.apply(1, applyDelayOnSearch);
    }

    public async sort(field: any, direction: any) {
        this.currentState.sort = {
            field: field,
            direction: direction
        };

        return this.apply(this.ngtPagination.getCurrentPage());
    }

    public async refresh(stayInPage: NgtDatatableParam = NgtDatatableParam.RESET_PAGE, loader: NgtDatatableParam = NgtDatatableParam.ENABLE_LOADER) {
        return this.apply(
            stayInPage ? this.ngtPagination.getCurrentPage() : 1,
            false,
            loader
        );
    }

    public getData() {
        return this.data;
    }

    public getCurrentSort() {
        return this.currentState.sort;
    }

    public setPerPage(perPage: number) {
        this.ngtPagination.onRegistersPerPageChange(perPage);
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
            delete this.currentState.filters.silentFilters[reference];

            this.filtersTranslated = this.filtersTranslated.filter(element => element && element.reference !== reference);
        }

        this.onClearFilter.emit(reference);

        if (this.inputSearch && (reference === 'term' || !reference)) {
            this.inputSearch.clearInput();
        }

        this.apply(this.ngtPagination.getCurrentPage(), false).then(() => this.cleaningFilter = false);
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

        return !!Object.values(appliedFilters)?.find(filter => !!filter);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.inputSearch) {
            if (changes.inputSearch.currentValue) {
                this.initSearchWithInput();
            }
        }

        if (changes.type) {
            this.type = getEnumFromString(changes.type.currentValue, NgtDatatableType);
        }
    }

    public async apply(page = 1, applyDelayOnSearch: boolean = true, loader: NgtDatatableParam = NgtDatatableParam.ENABLE_LOADER) {
        if (!this.componentReady) {
            return;
        } else if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.ngtPagination.displayPagination = false;
        this.selectedElements = [];

        if (this.type === NgtDatatableType.REMOTE) {
            if (this.remoteResource) {
                if (loader) {
                    this.loading = true;
                    this.bindVisibilityAttributes();
                }

                if (applyDelayOnSearch) {
                    this.searchTimeout = setTimeout(() => {
                        this.loadData(page);
                    }, this.searchDelay);
                } else {
                    this.loadData(page);
                }
            } else {
                console.error('The property [remoteResource] needs to be present to be able to make remote search');
            }
        } else if (this.type == NgtDatatableType.FIXED) {
            this.bindVisibilityAttributes();
        }
    }

    private loadData(page: number) {
        const pagination: NgtHttpPagination = { ...this.ngtPagination.getPagination(), ...{ page: page } };

        this.currentState.filters.qualifiedFilters = this.getQualifiedFilters();

        this.subscriptions.push(
            this.ngtHttpService.get(
                this.remoteResource, this.currentState.filters.qualifiedFilters, pagination, this.currentState.sort
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
                    this.changeDetector.detectChanges();
                }
            )
        );
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
        this.subscriptions.push(
            this.inputSearch.onValueChange().subscribe((value: string) => {
                if (this.currentState.filters.defaultFilters['term']) {
                    if (!value) {
                        this.removeFilter('term');
                    } else if (value.length < this.searchTermMinLength) {
                        delete this.currentState.filters.defaultFilters['term'];

                        this.search({ term: '' });
                    }
                }

                if (value.length >= this.searchTermMinLength) {
                    this.search({ term: value });
                }
            })
        );

        if (this.searchTermOnEnter) {
            this.inputSearch.element.nativeElement.addEventListener('keydown', (event: any) => {
                event.stopImmediatePropagation();

                if (event.keyCode == 13) {
                    if (this.inputSearch.value && this.inputSearch.value.length >= this.searchTermMinLength) {
                        this.apply(1, false);
                    }
                }
            });
        }
    }

    private initCheckboxEvent() {
        this.subscriptions.push(
            this.onToogleCheckbox.subscribe((checkedElement: NgtCheckedElement) => {
                this.selectedElements = this.selectedElements.filter(item => item.id !== checkedElement.id);

                if (checkedElement.checked) {
                    this.selectedElements.push(checkedElement);
                }

                this.onSelectedElementsChange.emit(this.selectedElements);
            })
        );
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
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

export enum NgtDatatableParam {
    STAY_IN_PAGE = 1,
    RESET_PAGE = 0,
    ENABLE_LOADER = 1,
    DISABLE_LOADER = 0
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
