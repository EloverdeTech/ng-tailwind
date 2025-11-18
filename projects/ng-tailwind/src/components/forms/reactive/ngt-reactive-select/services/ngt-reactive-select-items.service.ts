import { Injectable, signal, WritableSignal, OutputEmitterRef } from "@angular/core";
import { Observable, Observer, Subject } from "rxjs";
import { NgtReactiveSelectSearchService } from "./ngt-reactive-select-search.service";

export interface NgtReactiveSelectItemsConfig {
    remoteResource: any;
    items: any[] | Observable<any>;
    autoSelectUniqueOption: boolean;
    guessCompareWith: boolean;
    compareWith: (a: any, b: any) => boolean;
    currentValue: any;
    canLoadItems: boolean;
    ngSearchObserver: Observer<any>;
    onNativeChange: (value: any) => void;
    onLoadRemoteResource: OutputEmitterRef<any>;
}

@Injectable({ providedIn: null })
export class NgtReactiveSelectItemsService {
    private originalItems: WritableSignal<any[]> = signal([]);
    private typeaheadSubject: WritableSignal<Subject<string>> = signal(new Subject());
    private ngSearchObserver: Observer<any> | null = null;

    public constructor(
        private searchService: NgtReactiveSelectSearchService,
    ) { }

    public initializeItems(config: NgtReactiveSelectItemsConfig): Observable<any> {
        if (config.remoteResource && config.canLoadItems) {
            const ngSelectItems = new Observable(observer => {
                this.ngSearchObserver = observer;
                config.ngSearchObserver = observer;

                this.searchService.loadRemoteData(config);
            });

            const typeaheadSubject = new Subject<string>();

            this.typeaheadSubject.set(typeaheadSubject);

            return ngSelectItems;
        }

        if (config.items instanceof Observable) {
            return config.items;
        }

        const itemsArray = Array.isArray(config.items) ? config.items : [];

        const canAutoSelect = !config.currentValue
            && config.autoSelectUniqueOption
            && itemsArray.length === 1;

        if (canAutoSelect) {
            config.onNativeChange(itemsArray[0]);
        }

        return new Observable((observer) => {
            this.ngSearchObserver = observer;
            config.ngSearchObserver = observer;
            observer.next(itemsArray);
        });
    }

    public getNgSearchObserver(): Observer<any> {
        return this.ngSearchObserver;
    }

    public getTypeaheadSubject(): Subject<string> {
        return this.typeaheadSubject();
    }

    public sortSelectedItems(value: any, sortFn?: (a: any, b: any) => any): any {
        if (sortFn && value instanceof Array && value.length > 1) {
            return value.sort((a, b) => sortFn(a, b));
        }

        return value;
    }

    public setOriginalItems(items: any[]): void {
        this.originalItems.set(items);
    }

    public getOriginalItems(): any[] {
        return this.originalItems();
    }

    public hadPreviousSelection(
        item: any,
        compareWithFn: (a: any, b: any) => boolean
    ): boolean {
        return !!this.originalItems()?.find(element => compareWithFn(element, item));
    }
}
