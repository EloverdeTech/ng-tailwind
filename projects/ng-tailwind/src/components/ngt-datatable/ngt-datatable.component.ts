import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    OnInit,
    Optional,
    OutputRefSubscription,
    TemplateRef,
    ViewChild,
    computed,
    effect,
    input,
    output,
    signal,
    WritableSignal,
    Input,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtHttpPagination, NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtInputComponent } from '../forms/template-driven/ngt-input/ngt-input.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtPaginationComponent } from '../ngt-pagination/ngt-pagination.component';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

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

@Component({
    selector: 'ngt-datatable',
    templateUrl: './ngt-datatable.component.html',
    styleUrls: ['./ngt-datatable.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtDatatableComponent implements OnInit, OnDestroy {
    @ViewChild('table', { static: true }) public table: ElementRef;
    @ViewChild('ngtPagination', { static: true }) public ngtPagination: NgtPaginationComponent;
    @ViewChild('searchModal', { static: true }) public searchModal: NgtModalComponent;

    /** Inputs */

    @Input() public remoteResource: any;

    // public readonly remoteResource = input<any>();
    public readonly type = input<NgtDatatableType | string>(NgtDatatableType.REMOTE);
    public readonly filterTagBgColor = input<string>('bg-blue-500');
    public readonly filterTagMargin = input<string>('mb-4');
    public readonly paginationMargin = input<string>('mt-2 md:mt-8');
    public readonly inputSearch = input<NgtInputComponent>();
    public readonly searchDelay = input<number>(500);
    public readonly searchTermMinLength = input<number>(1);
    public readonly defaultFilters = input<any>({});
    public readonly filtersDescription = input<Record<string, any>>({});
    public readonly canSelectAllRegisters = input<boolean>(false);

    /** Outputs */

    public readonly onDataChange = output<any>();
    public readonly onClearFilter = output<any>();
    public readonly onClearSelectedElements = output<void>();
    public readonly onSelectedElementsChange = output<Array<NgtCheckedElement>>();
    public readonly onToogleAllCheckboxes = output<any>();
    public readonly onToogleCheckbox = output<NgtCheckedElement>();
    public readonly onSelectAllRegisters = output<void>();
    public readonly onOpenSearchModal = output<string>();
    public readonly onSearch = output<any>();

    /** Signals */

    public readonly searchModalTemplate: WritableSignal<TemplateRef<any>> = signal(null);
    public readonly dataState: WritableSignal<any[]> = signal([]);
    public readonly loadingState: WritableSignal<boolean> = signal(false);
    public readonly cleaningFilterState: WritableSignal<boolean> = signal(false);
    public readonly componentReadyState: WritableSignal<boolean> = signal(false);
    public readonly filtersTranslatedState: WritableSignal<any[]> = signal([]);
    public readonly columnCountState: WritableSignal<any[]> = signal([]);
    public readonly selectedElementsSignal: WritableSignal<Array<NgtCheckedElement>> = signal([]);
    public readonly hasSelectedAllElementsSignal = signal<boolean>(false);

    public readonly emptyStateVisibleState = computed(() =>
        this.resolvedType() === NgtDatatableType.REMOTE
            ? !this.dataState().length && !this.loadingState()
            : false
    );

    /** Other */

    public filterModalStyle: NgtStylizableService = new NgtStylizableService();

    public readonly resolvedType = computed(() => this.normalizeType(this.type()));

    private readonly filtersDescriptionState = signal<Record<string, any>>({});
    private readonly searchingState = signal<boolean>(false);

    private readonly resolvedSearchDelay = signal<number>(500);
    private readonly resolvedSearchTermMinLength = signal<number>(1);

    private searchTimeout: any;
    private subscriptions: Array<Subscription | OutputRefSubscription> = [];
    private inputSearchSubscription: OutputRefSubscription;
    private currentInputSearch: NgtInputComponent;

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

        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        this.filterModalStyle.load(this.injector, 'FilterModal', {
            w: 'md:max-w-md',
            py: 'py-4',
            px: 'px-6',
            border: 'border border-teal-500',
            overflow: 'overflow-visible',
            color: {}
        });

        effect(() => {
            const delay = this.searchDelay();
            const injected = this.injector.get('NgtDatatableSearchDelay', 500);
            const resolved = delay === 500 && injected !== delay ? injected : delay;

            this.resolvedSearchDelay.set(resolved);
        });

        effect(() => {
            const minLength = this.searchTermMinLength();
            const injected = this.injector.get('NgtDatatableSearchTermMinLength', 1);
            const resolved = minLength === 1 && injected !== minLength ? injected : minLength;

            this.resolvedSearchTermMinLength.set(resolved);
        });

        effect(() => {
            const inputSearch = this.inputSearch();

            if (inputSearch) {
                this.initSearchWithInput(inputSearch);
            }
        });

        effect(() => {
            this.filtersDescriptionState.set(this.filtersDescription() ?? {});
        });
    }

    public get data(): any[] {
        return this.dataState();
    }

    public set data(value: any[]) {
        this.dataState.set(value);
    }

    public get selectedElements(): Array<NgtCheckedElement> {
        return this.selectedElementsSignal();
    }

    public get loading(): boolean {
        return this.loadingState();
    }

    public set loading(value: boolean) {
        this.loadingState.set(value);
    }


    public get cleaningFilter(): boolean {
        return this.cleaningFilterState();
    }

    public get componentReady(): boolean {
        return this.componentReadyState();
    }

    public get filtersTranslated(): any[] {
        return this.filtersTranslatedState();
    }

    public get emptyStateVisible(): boolean {
        return this.emptyStateVisibleState();
    }

    public get hasSelectedAllElements(): boolean {
        return this.hasSelectedAllElementsSignal();
    }

    public get columnCount(): any[] {
        return this.columnCountState();
    }

    public ngOnInit() {
        if (this.table?.nativeElement?.rows?.[0]?.cells) {
            this.columnCountState.set(Array.from(this.table.nativeElement.rows[0].cells));
        }

        this.initCheckboxEvent();
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
        this.cleanupInputSearch();
    }

    public setSearchModalTemplate(template: TemplateRef<any>) {
        this.searchModalTemplate.set(template);
    }

    public openSearchModal(reference?: string) {
        this.searchModal.open();
        this.onOpenSearchModal.emit(reference);
    }

    public clearSelectedElements() {
        this.selectedElementsSignal.set([]);
        this.onClearSelectedElements.emit();
    }

    public getCurrentState() {
        return this.currentState;
    }

    public init() {
        this.componentReadyState.set(true);
    }

    public async search(
        filters: Object,
        searchType: NgtDatatableSearchType = NgtDatatableSearchType.DEFAULT,
        applyDelayOnSearch: boolean = true
    ) {
        if (this.canApplyFilters(filters)) {
            this.onSearch.emit(filters);

            if (searchType == NgtDatatableSearchType.DEFAULT) {
                this.currentState.filters.defaultFilters = { ...this.currentState.filters.defaultFilters, ...filters };
            } else {
                this.currentState.filters.silentFilters = { ...this.currentState.filters.silentFilters, ...filters };
            }

            this.applyFiltersDescription();

            return this.apply(1, applyDelayOnSearch);
        }
    }

    public async sort(field: any, direction: any) {
        this.currentState.sort = {
            field: field,
            direction: direction
        };

        return this.apply(this.ngtPagination.getCurrentPage());
    }

    public async refresh(
        stayInPage: NgtDatatableParam = NgtDatatableParam.RESET_PAGE,
        loader: NgtDatatableParam = NgtDatatableParam.ENABLE_LOADER
    ) {
        return this.apply(
            stayInPage ? this.ngtPagination.getCurrentPage() : 1,
            false,
            loader
        ).then(() => !this.dataState()?.length && stayInPage ? this.apply(1, false) : null);
    }

    public getData() {
        return this.dataState();
    }

    public getCurrentSort() {
        return this.currentState.sort;
    }

    public setPerPage(perPage: number) {
        this.ngtPagination.onRegistersPerPageChange(perPage);
    }

    public applyFiltersDescription() {
        if (!this.cleaningFilterState()) {
            const filtersTranslated = [];
            const filtersDescription = this.filtersDescriptionState();

            for (let reference in this.currentState.filters.defaultFilters) {
                if (filtersDescription[reference] && this.currentState.filters.defaultFilters[reference]) {
                    filtersTranslated.push({
                        reference: reference,
                        value: this.currentState.filters.defaultFilters[reference],
                        translation: filtersDescription[reference]
                    });
                }
            }

            this.filtersTranslatedState.set(filtersTranslated);
        }
    }

    public setFilterDescription(reference: string, description: string) {
        this.filtersDescriptionState.update(current => ({
            ...current,
            [reference]: description
        }));
    }

    public async removeFilter(reference?: string, refresh: boolean = true): Promise<void> {
        return new Promise(resolve => {
            if (reference && !this.hasAppliedFilter(reference)) {
                return resolve();
            }

            this.cleaningFilterState.set(true);

            if (!reference) {
                this.currentState.filters.defaultFilters = {};
                this.currentState.filters.silentFilters = {};
                this.filtersTranslatedState.set([]);
            } else {
                delete this.currentState.filters.defaultFilters[reference];
                delete this.currentState.filters.silentFilters[reference];

                this.filtersTranslatedState.set(
                    this.filtersTranslatedState().filter(element => element && element.reference !== reference)
                );
            }

            this.onClearFilter.emit(reference);

            if (this.inputSearch() && (reference === 'term' || !reference)) {
                this.inputSearch().clearInput();
            }

            if (refresh) {
                return this.apply(this.ngtPagination.getCurrentPage(), false)
                    .then(() => {
                        this.cleaningFilterState.set(false);

                        resolve();
                    });
            }

            resolve();
        });
    }

    public hasAppliedFilter(filter: Object | NgtCustomFilter | string): boolean {
        const reference: string = typeof filter === 'string' ? filter : Object.keys(filter ?? {})[0];
        const appliedFilters = this.currentState.filters.qualifiedFilters;

        return !!Object.keys(appliedFilters).find(key => key == reference);
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

    public async apply(
        page = 1,
        applyDelayOnSearch: boolean = true,
        loader: NgtDatatableParam = NgtDatatableParam.ENABLE_LOADER
    ) {
        return new Promise<void>(resolve => {
            if (!this.componentReadyState()) {
                return resolve();
            } else if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.ngtPagination.displayPagination = false;
            this.selectedElementsSignal.set([]);

            if (this.resolvedType() === NgtDatatableType.REMOTE) {
                if (this.remoteResource) {
                    if (loader) {
                        this.loadingState.set(true);
                    }

                    if (applyDelayOnSearch) {
                        this.searchTimeout = setTimeout(() => {
                            this.loadData(page).then(() => resolve());
                        }, this.resolvedSearchDelay());
                    } else {
                        this.loadData(page).then(() => resolve());
                    }
                } else {
                    console.error('The property [remoteResource] needs to be present to be able to make remote search');
                }
            } else if (this.resolvedType() == NgtDatatableType.FIXED) {
                resolve();
            }
        });
    }

    public getTagFilterValue(filter: any): string {
        const filtersTag = this.getFiltersTagArray(filter);

        return filtersTag.length > 1
            ? filtersTag[0] + ' +'
            : filtersTag[0];
    }

    public getTitle(filter: any): string {
        const filtersTag = this.getFiltersTagArray(filter);

        return filtersTag.length > 1
            ? filtersTag.slice(1).join(',')
            : '';
    }

    private getFiltersTagArray(filter: any): string[] {
        const tag = filter?.value?.tagValue ? filter.value.tagValue : filter.value;

        return tag.split(',');
    }

    private loadData(page: number) {
        return new Promise<void>((resolve, reject) => {
            const pagination: NgtHttpPagination = { ...this.ngtPagination.getPagination(), ...{ page: page } };

            this.currentState.filters.qualifiedFilters = this.getQualifiedFilters();
            this.searchingState.set(true);

            this.inputSearch()?.setDisabledState(true);

            this.subscriptions.push(
                this.ngtHttpService.get(
                    this.remoteResource, this.currentState.filters.qualifiedFilters, pagination, this.currentState.sort
                ).subscribe(
                    (response: NgtHttpResponse) => {
                        this.proccessRemoteResponse(response.data);

                        if (response.meta) {
                            this.ngtPagination.proccessPagination(response.meta);
                        }

                        this.searchingState.set(false);
                        this.loadingState.set(false);

                        this.inputSearch()?.setDisabledState(false);

                        this.onDataChange.emit(this.dataState());

                        resolve();
                    },
                    (error) => {
                        console.error(error);
                        this.loadingState.set(false);

                        this.inputSearch()?.setDisabledState(false);

                        reject();
                    }
                )
            );
        });
    }

    private getQualifiedFilters() {
        const qualifiedFilters = {};
        const requestedFilters = { ...this.currentState.filters.defaultFilters, ...this.currentState.filters.silentFilters };

        if (requestedFilters) {
            for (const reference in requestedFilters) {
                if (Object.prototype.hasOwnProperty.call(requestedFilters, reference)) {
                    const filter = requestedFilters[reference];

                    if (this.isValidFilter(filter, reference)) {
                        if (filter instanceof NgtCustomFilter) {
                            if (filter.tagLabel) {
                                this.filtersDescriptionState.update(current => ({
                                    ...current,
                                    [reference]: filter.tagLabel
                                }));
                                this.applyFiltersDescription();
                            }

                            qualifiedFilters[reference] = filter.term;
                        } else {
                            qualifiedFilters[reference] = filter;
                        }
                    }
                }
            }
        }

        return qualifiedFilters;
    }

    private proccessRemoteResponse(response: any) {
        this.dataState.set(response ?? []);
    }

    private initSearchWithInput(inputSearch: NgtInputComponent) {
        if (!inputSearch) {
            return;
        }

        if (this.currentInputSearch === inputSearch) {
            return;
        }

        this.cleanupInputSearch();

        this.currentInputSearch = inputSearch;

        this.inputSearchSubscription = inputSearch.onValueChange.subscribe((value: string) => {
            const currentSearchTerm = this.currentState.filters.defaultFilters['term'];

            if (currentSearchTerm) {
                if (value == currentSearchTerm) {
                    return;
                }

                if (!value) {
                    this.removeFilter('term');
                } else if (value.length < this.resolvedSearchTermMinLength()) {
                    delete this.currentState.filters.defaultFilters['term'];

                    this.search({ term: '' });
                }
            }

            if (value.length >= this.resolvedSearchTermMinLength()) {
                this.search({ term: value });
            }
        });
    }

    private initCheckboxEvent() {
        this.subscriptions.push(
            this.onToogleCheckbox.subscribe((checkedElement: NgtCheckedElement) => {
                this.selectedElementsSignal.set(
                    this.selectedElementsSignal().filter(item => item.id !== checkedElement.id)
                );

                if (checkedElement.checked) {
                    this.selectedElementsSignal.set([
                        ...this.selectedElementsSignal(),
                        checkedElement
                    ]);
                }

                this.onSelectedElementsChange.emit(this.selectedElementsSignal());
            })
        );

        this.subscriptions.push(
            this.onSelectAllRegisters.subscribe(() => {
                this.hasSelectedAllElementsSignal.set(!this.hasSelectedAllElementsSignal());

                if (!this.hasSelectedAllElementsSignal()) {
                    this.selectedElementsSignal.set([]);
                }
            })
        );
    }

    private canApplyFilters(filters: Object): boolean {
        if (!this.searchingState()) {
            for (const reference in filters) {
                if (this.isValidFilter(filters[reference], reference)) {
                    return true;
                }
            }
        }

        return false;
    }

    private isValidFilter(filter: string | NgtCustomFilter, reference: string): boolean {
        const hasValue: boolean = !!((filter instanceof NgtCustomFilter && filter.term) || filter);
        const isApplied: boolean = this.hasAppliedFilter(reference);

        return isApplied || (!isApplied && hasValue);
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private cleanupInputSearch(): void {
        this.inputSearchSubscription?.unsubscribe();
        this.inputSearchSubscription = null;
        this.currentInputSearch = null;
    }

    private normalizeType(type: NgtDatatableType | string): NgtDatatableType {
        if (!type) {
            return NgtDatatableType.REMOTE;
        }

        return typeof type === 'string'
            ? getEnumFromString(type, NgtDatatableType)
            : type;
    }
}
