import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    Host,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Self,
    SimpleChanges,
    SkipSelf,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlContainer, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Observer, Subject, Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { getEnumFromString } from '../../helpers/enum/enum';
import { uuid } from '../../helpers/uuid';
import { NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSelectHeaderTmp, NgtSelectOptionSelectedTmp, NgtSelectOptionTmp } from './ngt-select.directive';

@Component({
    selector: 'ngt-select',
    templateUrl: './ngt-select.component.html',
    styleUrls: ['./ngt-select.component.css'],
    providers: [
        NgtMakeProvider(NgtSelectComponent)
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    encapsulation: ViewEncapsulation.None
})
export class NgtSelectComponent extends NgtBaseNgModel implements OnChanges, OnDestroy {
    @ViewChild(NgSelectComponent, { static: true }) public ngSelectComponent: NgSelectComponent;
    @ContentChild(NgtSelectOptionTmp, { static: false, read: TemplateRef }) public ngtOptionTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectOptionSelectedTmp, { static: false, read: TemplateRef }) public ngtOptionSelectedTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectHeaderTmp, { static: false, read: TemplateRef }) public ngtSelectHeaderTemplate: TemplateRef<any>;

    /** Visual */
    @Input() public label: string = '';
    @Input() public helpTitle: string;
    @Input() public helpText: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public shining = false;
    @Input() public loading: boolean = false;
    @Input() public loadingText: string = '';
    @Input() public notFoundText: string = '';
    @Input() public dropdownPosition = 'auto';
    @Input() public typeToSearchText: string = '';
    @Input() public clearAllTooltip: string = '';
    @Input() public placeholder: string = '';
    @Input() public createText: string = '';
    @Input() public labelForId: string = '';
    @Input() public dropdownPanelMinHeight: NgtSelectDropdownPanelHeight = NgtSelectDropdownPanelHeight.AUTO;

    /** Behavior */
    @Input() public name: string;
    @Input() public allowCreate: boolean | Promise<any> | Function = false;
    @Input() public isDisabled: boolean = false;
    @Input() public remoteResource: any;
    @Input() public hideSelected: boolean;
    @Input() public bindLabel: string = 'name';
    @Input() public bindValue: string;
    @Input() public items: Array<any> | Observable<any> = [];
    @Input() public closeOnSelect: boolean = true;
    @Input() public clearable: boolean = true;
    @Input() public groupBy: string | Function = null;
    @Input() public maxSelectedItems: number;
    @Input() public multiple: boolean = false;
    @Input() public searchable: boolean = true;
    @Input() public clearSearchOnAdd: boolean = true;
    @Input() public virtualScroll: boolean = true;
    @Input() public tabIndex: number;
    @Input() public typeahead: Subject<any>;
    @Input() public groupValue: (groupKey: string, cildren: any[]) => Object;
    @Input() public trackBy: (item: any) => any;

    /** Validation */
    @Input() public isRequired: boolean = false;

    public nativeName = uuid();
    public ngtStyle: NgtStylizableService;
    public ngSelectItems: any = [];
    public nativeValue: any;
    public componentReady: boolean = false;

    private ngSearchObserver: Observer<any>;
    private originalPerPage = 15;
    private subscriptions: Array<Subscription> = [];

    private currentState = {
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

    private searchTimeout: any;

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,
        private injector: Injector,
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        public ngtFormComponent: NgtFormComponent,
        private ngtHttp: NgtHttpService,
        private changeDetector: ChangeDetectorRef,
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        super();

        if (this.ngtFormComponent) {
            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtSelect', {
            h: 'h-12',
            color: {
                bg: 'bg-white'
            }
        });
    }

    @Input()
    public compareWith = (a: any, b: any) => a === b;

    public ngOnInit() {
        this.initNgSelectItems();
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public ngAfterContentInit() {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name) {
            console.error("The element must contain a name attribute!");
        } else {
            setTimeout(() => {
                this.componentReady = true;
                this.initComponent();
                this.replaceShowAddTag();
                this.ngSelectComponent.itemsList.mapSelectedItems();

                if (!this.getElementTitle() || this.getElementTitle() === 'null') {
                    this.ngSelectComponent.element.parentElement.parentElement.parentElement.title = '';
                }

                this.changeDetector.detectChanges();
            }, 500);
        }
    }

    public removeItem(event: Event, item: any) {
        event.preventDefault();
        event.stopPropagation();

        return this.ngSelectComponent.clearItem(item);
    }

    public refresh() {
        this.initNgSelectItems();
        this.initComponent();
    }

    public reset() {
        this.value = undefined;
        this.nativeValue = undefined;
        this.refresh();
    }

    public initNgSelectItems() {
        if (this.remoteResource) {
            this.ngSelectItems = Observable.create(observer => {
                this.ngSearchObserver = observer;
                this.search({});
            });

            this.typeahead = new Subject();

            this.subscriptions.push(
                this.typeahead.subscribe((term) => {
                    this.search({ term: term });
                })
            );
        } else if (this.items instanceof Observable) {
            this.ngSelectItems = this.items;
        } else {
            if (!this.items) {
                this.items = [];
            }

            this.ngSelectItems = new Observable((observer) => {
                this.ngSearchObserver = observer;
                observer.next(this.items);
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.isRequired) {
            this.updateValidations();
        }

        if (changes.remoteResource || changes.items) {
            this.initNgSelectItems();
        }

        if (changes.dropdownPanelMinHeight) {
            this.dropdownPanelMinHeight = getEnumFromString(changes.dropdownPanelMinHeight.currentValue, NgtSelectDropdownPanelHeight);
        }
    }

    public setFocus() {
        setTimeout(() => {
            this.ngSelectComponent.focus();
        });
    }

    public onClearSelect() {
        if (!this.nativeValue) {
            this.markAsPristine();
        }

        this.currentState.filters = {};
    }

    public getFilterInputValue() {
        let inputField = this.ngSelectComponent.filterInput ?
            this.ngSelectComponent.filterInput :
            this.ngSelectComponent['searchInput'];

        if (
            inputField &&
            inputField.nativeElement
        ) {
            return inputField.nativeElement.value;
        }
    }

    public search(filters: any) {
        this.currentState.filters = { ...this.currentState.filters, ...filters };

        if (!this.remoteResource) {
            return;
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.loading = true;
        this.changeDetector.detectChanges();

        this.searchTimeout = setTimeout(() => {
            this.subscriptions.push(
                this.ngtHttp
                    .get(this.remoteResource, this.currentState.filters, this.currentState.pagination)
                    .subscribe(
                        (response: NgtHttpResponse) => {
                            this.loading = false;
                            this.ngSearchObserver.next(response.data);
                            this.currentState.pagination = response.meta.pagination;
                            this.changeDetector.detectChanges();
                        },
                        (error) => {
                            this.loading = false;
                            this.changeDetector.detectChanges();
                            console.error(error);
                            this.ngSearchObserver.next([]);
                        }
                    )
            );
        }, 500);
    }

    public onNativeChange(value) {
        if (this.hasChangesBetweenModels(this.value, value)) {
            this.value = value;
        }
    }

    public change(value) {
        if (this.hasChangesBetweenModels(value, this.nativeValue)) {
            if (Array.isArray(value)) {
                value = value.map((val) => val);
            }

            this.nativeValue = value;

            if (!value) {
                this.markAsPristine();
            }
        }
    }

    public onScroll({ end }) {
        let currentPerPage = this.currentState.pagination.per_page;
        let maxItensInBackend = this.currentState.pagination.total;

        if (end >= currentPerPage && end <= maxItensInBackend) {
            this.currentState.pagination.per_page = parseInt(this.currentState.pagination.per_page) + this.originalPerPage;
            this.search({});
        }
    }

    public hasSelectedValue() {
        return this.value && JSON.stringify(this.value);
    }

    public getSelectClass() {
        let selectClass = this.dropdownPanelMinHeight ? 'ng-select-dropdown-panel-' + this.dropdownPanelMinHeight : 'ng-select-dropdown-panel-auto';

        if (this.isDisabled) {
            selectClass += ' select-border-disabled';
        } else if (this.formControl && this.formControl.errors && (this.formControl.dirty || (this.formContainer && this.formContainer['submitted']))) {
            selectClass += ' select-border-error';
        } else {
            selectClass += ' select-border-normal';
        }

        return selectClass;
    }

    private initComponent() {
        if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
            this.formControl = this.formContainer.control.get(this.name);
            this.markAsPristine();
            this.updateValidations();
        }
    }

    private getElementTitle(): string {
        return this.ngSelectComponent.element.parentElement.parentElement.parentElement.title;
    }

    private hasChangesBetweenModels(value, nativeValue) {
        return JSON.stringify(value) !== JSON.stringify(nativeValue);
    }

    private updateValidations() {
        if (!this.formControl) {
            return;
        }

        let syncValidators = [];

        if (this.isRequired) {
            syncValidators.push(this.isRequiredValidator());
        }

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private isRequiredValidator() {
        return (control: AbstractControl) => {
            if (this.multiple) {
                if (Array.isArray(this.value) && this.value.length > 0) {
                    return null;
                }
            } else if (control.value && JSON.stringify(control.value)) {
                return null;
            }

            return { 'required': true };
        };
    }

    private replaceShowAddTag() {
        Object.defineProperty(this.ngSelectComponent, 'showAddTag', {
            get: () => {
                if (!this.ngSelectComponent['searchTerm']) {
                    return false;
                }

                const term = this.ngSelectComponent['searchTerm'].toLocaleLowerCase();

                return this.ngSelectComponent.addTag && !this.ngSelectComponent.loading
                    && (!this.hasTermInFilteredItems(term) && (!this.hasTermInSelectedItems(term)
                        || !this.ngSelectComponent.hideSelected && this.ngSelectComponent.isOpen));
            }
        });
    }

    private hasTermInFilteredItems(term: string) {
        const filteredItems = this.ngSelectComponent.itemsList.filteredItems;

        if (this.isColoquentResource()) {
            return filteredItems.some((element: any) => {
                const elementValue = (<any>element.value).getAttribute(this.bindLabel);

                return elementValue && elementValue.toLocaleLowerCase() === term;
            });
        }

        return filteredItems.some((element: any) => {
            const elementValue = (<any>element.value)[this.bindLabel];

            return elementValue && elementValue.toLocaleLowerCase() === term;
        });
    }

    private hasTermInSelectedItems(term: string) {
        const selectedItems = this.ngSelectComponent.selectedItems;

        if (this.isColoquentResource()) {
            return selectedItems.some((element: any) => {
                const elementValue = (<any>element.value).getAttribute(this.bindLabel);

                return elementValue && elementValue.toLocaleLowerCase() === term;
            });
        }

        return selectedItems.some((element: any) => {
            const elementValue = (<any>element.value)[this.bindLabel];

            return elementValue && elementValue.toLocaleLowerCase() === term;
        });
    }

    private isColoquentResource() {
        const filteredItems = this.ngSelectComponent.itemsList.filteredItems;

        return filteredItems && filteredItems.length && typeof filteredItems[0].value['getAttribute'] === 'function';
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtSelectDropdownPanelHeight {
    AUTO = 'auto',
    XS = 'xs',
    MD = 'md',
    SM = 'sm',
    LG = 'lg',
    XL = 'xl'
}
