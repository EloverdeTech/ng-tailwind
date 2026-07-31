import { Injectable } from "@angular/core";
import { NgSelectComponent } from "@ng-select/ng-select";
import { NgtReactiveSelectStateService } from "./ngt-reactive-select-state.service";

export interface NgtReactiveSelectAddTagConfig {
    ngSelectComponent: NgSelectComponent;
    bindLabel: string;
}

@Injectable({ providedIn: null })
export class NgtReactiveSelectTagManagerService {
    public constructor(
        private stateService: NgtReactiveSelectStateService,
    ) { }

    public replaceShowAddTag(config: NgtReactiveSelectAddTagConfig): void {
        Object.defineProperty(config.ngSelectComponent, 'showAddTag', {
            get: () => {
                if (!config.ngSelectComponent['searchTerm']) {
                    return false;
                }

                const term = config.ngSelectComponent['searchTerm'].toLocaleLowerCase();

                return config.ngSelectComponent.addTag && !this.stateService.loading()
                    && (
                        !this.hasTermInFilteredItems(config.ngSelectComponent, term, config.bindLabel)
                        && (
                            !this.hasTermInSelectedItems(config.ngSelectComponent, term, config.bindLabel)
                            || (!config.ngSelectComponent.hideSelected && config.ngSelectComponent.isOpen)
                        )
                    );
            }
        });
    }

    private hasTermInFilteredItems(
        ngSelectComponent: NgSelectComponent,
        term: string,
        bindLabel: string
    ): boolean {
        const filteredItems = ngSelectComponent.itemsList.filteredItems;

        if (filteredItems?.length && this.isColoquentResource(ngSelectComponent)) {
            return filteredItems.some((element: any) => {
                const elementValue = (<any>element.value).getAttribute(bindLabel);

                return elementValue && elementValue.toLocaleLowerCase() === term;
            });
        }

        return filteredItems.some((element: any) => {
            const elementValue = (<any>element.value)[bindLabel];

            return elementValue && elementValue.toLocaleLowerCase() === term;
        });
    }

    private hasTermInSelectedItems(
        ngSelectComponent: NgSelectComponent,
        term: string,
        bindLabel: string
    ): boolean {
        const selectedItems = ngSelectComponent.selectedItems;

        if (selectedItems?.length && this.isColoquentResource(ngSelectComponent)) {
            return selectedItems.some((element: any) => {
                const elementValue = (<any>element.value).getAttribute(bindLabel);

                return elementValue && elementValue.toLocaleLowerCase() === term;
            });
        }

        return selectedItems.some((element: any) => {
            const elementValue = (<any>element.value)[bindLabel];

            return elementValue && elementValue.toLocaleLowerCase() === term;
        });
    }

    private isColoquentResource(ngSelectComponent: NgSelectComponent): boolean {
        const items = ngSelectComponent.itemsList.items;

        return items?.length && typeof items[0].value['getAttribute'] === 'function';
    }
}
