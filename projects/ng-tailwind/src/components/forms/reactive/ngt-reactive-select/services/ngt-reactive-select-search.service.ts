import { Injectable, OutputEmitterRef } from "@angular/core";
import { Observer } from "rxjs";
import { NgtHttpResponse, NgtHttpService } from "../../../../../services/http/ngt-http.service";
import { NgtReactiveSelectStateService } from "./ngt-reactive-select-state.service";

export interface NgtReactiveSelectSearchConfig {
    remoteResource: any;
    guessCompareWith: boolean;
    compareWith: (a: any, b: any) => boolean;
    autoSelectUniqueOption: boolean;
    currentValue: any;
    ngSearchObserver: Observer<any>;
    onNativeChange: Function;
    onLoadRemoteResource: OutputEmitterRef<any>;
}

@Injectable({ providedIn: null })
export class NgtReactiveSelectSearchService {
    private readonly searchState = {
        filters: {},
        sort: {
            field: '',
            direction: ''
        },
        pagination: {
            count: null,
            page: 1,
            pages: null,
            total: null,
            from: null,
            to: null,
            per_page: null
        }
    };

    private readonly originalPerPage = 15;

    private searchTimeout: NodeJS.Timeout;

    public constructor(
        private ngtHttp: NgtHttpService,
        private stateService: NgtReactiveSelectStateService,
    ) { }

    public loadRemoteData(config: NgtReactiveSelectSearchConfig, filters: any = {}): void {
        this.searchState.filters = { ...this.searchState.filters, ...filters };

        if (!config.remoteResource) {
            console.error('You need to provide a remote resorce to make HTTP requests.');

            return;
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.compareWithFn = config.compareWith;

        this.stateService.loading.set(true);

        this.searchTimeout = setTimeout(() => {
            this.ngtHttp
                .get(config.remoteResource, this.searchState.filters, this.searchState.pagination)
                .subscribe({
                    next: (response: NgtHttpResponse) => {
                        this.bindCompareWithByResponse(response, config.guessCompareWith);

                        config.ngSearchObserver.next(response.data);

                        if (this.canAutoSelectUniqueOption(response, config)) {
                            config.onNativeChange(response.data[0]);
                        }

                        config.onLoadRemoteResource.emit(response.data);

                        this.searchState.pagination = response.meta.pagination;
                    },

                    error: (error) => {
                        console.error(error);

                        config.ngSearchObserver.next([]);
                    },

                    complete: () => {
                        this.stateService.loading.set(false);
                    }
                });
        }, 500);
    }

    public itemSearchFn(remoteResource: any, bindLabel: string) {
        return (term: string, item: any) => {
            if (remoteResource) {
                return null;
            }

            let formattedValue: any;

            if (typeof item == 'string') {
                formattedValue = item;
            }

            if (!bindLabel) {
                return null;
            }

            if (typeof item['getAttribute'] == 'function') {
                formattedValue = item.getAttribute([bindLabel]);
            } else if (typeof item == 'object') {
                formattedValue = item[bindLabel];
            }

            return formattedValue
                ? formattedValue.toLocaleLowerCase().includes(term.toLocaleLowerCase())
                : null;
        };
    };

    public handleScroll(end: number, searchCallback: () => void): void {
        const currentPerPage = this.searchState.pagination.per_page;
        const maxItemsInBackend = this.searchState.pagination.total;

        if (end >= currentPerPage && end <= maxItemsInBackend) {
            this.searchState.pagination.per_page = parseInt(
                String(this.searchState.pagination.per_page)
            ) + this.originalPerPage;

            searchCallback();
        }
    }

    public clearFilters(): void {
        this.searchState.filters = {};
    }

    public clearSearchTimeout(): void {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }

    public getCompareWithFn(): (a: any, b: any) => boolean {
        return this.compareWithFn;
    }

    private compareWithFn: (a: any, b: any) => boolean = (a: any, b: any) => a === b;

    private bindCompareWithByResponse(
        response: NgtHttpResponse,
        guessCompareWith: boolean,
    ): void {
        if (!guessCompareWith) {
            return;
        }

        if (response.data?.length && typeof response.data[0]['getApiId'] === 'function') {
            this.compareWithFn = (a: any, b: any) => a.getApiId() == b.getApiId();
        } else {
            this.compareWithFn = (a: any, b: any) => a === b;
        }
    }

    private canAutoSelectUniqueOption(
        response: NgtHttpResponse,
        config: NgtReactiveSelectSearchConfig
    ): boolean {
        return !config.currentValue
            && config.autoSelectUniqueOption
            && Array.isArray(response?.data)
            && response?.data?.length === 1;
    }
}
