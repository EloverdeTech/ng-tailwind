import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    DoCheck,
    EventEmitter,
    Host,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
    SimpleChanges,
    SkipSelf,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlContainer, NgForm } from '@angular/forms';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
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
export class NgtSelectComponent extends NgtBaseNgModel implements OnChanges, OnDestroy, OnInit, DoCheck {
    @ViewChild(NgSelectComponent, { static: true }) public ngSelectComponent: NgSelectComponent;
    @ContentChild(NgtSelectOptionTmp, { read: TemplateRef }) public ngtOptionTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectOptionSelectedTmp, { read: TemplateRef }) public ngtOptionSelectedTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectHeaderTmp, { read: TemplateRef }) public ngtSelectHeaderTemplate: TemplateRef<any>;

    /** Visual */
    @Input() public label: string = '';
    @Input() public labelIcon: string;
    @Input() public labelIconColor: string;
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
    @Input() public helperReverseYPosition: boolean;

    /** Behavior */
    @Input() public name: string;
    @Input() public autoLoad: boolean;
    @Input() public allowCreate: boolean | Promise<any> | Function = false;
    @Input() public allowOriginalItemsUnselect: boolean = true;
    @Input() public isDisabled: boolean = false;
    @Input() public isReadonly: boolean = false;
    @Input() public remoteResource: any;
    @Input() public hideSelected: boolean;
    @Input() public bindLabel: string = 'name';
    @Input() public bindValue: string;
    @Input() public items: Array<any> | Observable<any> = [];
    @Input() public inputAttrs: { [key: string]: string };
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
    @Input() public guessCompareWith: boolean = true;
    @Input() public groupValue: (groupKey: string, cildren: any[]) => Object;
    @Input() public trackBy: (item: any) => any;

    /** Validation */
    @Input() public isRequired: boolean = false;

    @Output() public onLoadRemoteResource: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onClear: EventEmitter<void> = new EventEmitter<void>();

    public nativeName = uuid();
    public ngtStyle: NgtStylizableService;
    public ngSelectItems: any = [];
    public nativeValue: any;
    public componentReady: boolean = false;
    public wasClicked: boolean;

    private ngSearchObserver: Observer<any>;
    private originalPerPage = 15;
    private subscriptions: Array<Subscription> = [];
    private originalItems: Array<any>;

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
    private hadFirstItemsLoad: boolean;

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
            this.shining = this.ngtFormComponent.isShining();

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
            text: 'text-sm',
            fontCase: '',
            color: {
                bg: 'bg-white'
            }
        });
    }

    @Input() public compareWith = (a: any, b: any) => a === b;

    public ngOnInit() {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name) {
            console.error("The element must contain a name attribute!");
        }

        if (!this.multiple && this.isRequired) {
            this.clearable = false;
        }

        if (this.multiple) {
            this.closeOnSelect = false;
        }

        setTimeout(() => {
            this.componentReady = true;
            this.initComponentValidation();
        }, 500);

        this.ngSelectItems = new Observable((observer) => {
            this.ngSearchObserver = observer;
            observer.next([]);
        });
    }

    public ngAfterViewInit() {
        this.bindInnerInputUniqueId();
    }

    public ngDoCheck(): void {
        if (!this.hadFirstItemsLoad && this.canLoadItems()) {
            this.hadFirstItemsLoad = true;

            this.initNgSelectItems();

            setTimeout(() => {
                this.replaceShowAddTag();

                this.ngSelectComponent.itemsList.mapSelectedItems();

                if (!this.getElementTitle() || this.getElementTitle() === 'null') {
                    this.ngSelectComponent.element.parentElement.parentElement.parentElement.title = '';
                }

                this.originalItems = this.ngSelectComponent.selectedItems?.map((element) => element.value);

                this.changeDetector.detectChanges();
            }, 500);
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public removeItem(event: Event, item: any) {
        event.preventDefault();
        event.stopPropagation();

        return this.ngSelectComponent.clearItem(item);
    }

    public refresh() {
        this.initNgSelectItems();
        this.initComponentValidation();
    }

    public reset() {
        this.value = undefined;
        this.nativeValue = undefined;
        this.refresh();
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

        this.onClear.emit();
    }

    public onRemoveSelectedItem(item: NgOption) {
        if (!this.allowOriginalItemsUnselect && this.hadPreviousSelection(item.value)) {
            setTimeout(() => this.ngSelectComponent.select(item));
        }
    }

    public getFilterInputValue() {
        let inputField = this.ngSelectComponent.searchInput ?
            this.ngSelectComponent.searchInput :
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

                            this.bindCompareWithByResponse(response);

                            this.ngSearchObserver.next(response.data);

                            this.onLoadRemoteResource.emit(response.data);

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

        if (this.multiple) {
            selectClass += ` h-auto ${this.ngtStyle.compile(['color.bg', 'color.text'])}`;
        } else {
            selectClass += ` ${this.ngtStyle.compile(['h', 'color.bg', 'color.text'])}`;
        }

        return selectClass;
    }

    private initNgSelectItems() {
        if (this.remoteResource && this.canLoadItems()) {
            this.ngSelectItems = new Observable(observer => {
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

    private initComponentValidation() {
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

    private bindInnerInputUniqueId() {
        const childInputs = this.ngSelectComponent.element.getElementsByTagName('input');

        if (childInputs?.length) {
            const innerInput = childInputs[0];

            innerInput.id = uuid();
        }
    }

    private bindCompareWithByResponse(response: NgtHttpResponse): void {
        if (this.guessCompareWith) {
            if (response.data?.length && typeof response.data[0]['getApiId'] === 'function') {
                this.compareWith = (a: any, b: any) => a.getApiId() == b.getApiId();
            } else {
                this.compareWith = (a: any, b: any) => a === b;
            }
        }
    }

    private hasTermInFilteredItems(term: string) {
        const filteredItems = this.ngSelectComponent.itemsList.filteredItems;

        if (filteredItems?.length && this.isColoquentResource()) {
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

        if (selectedItems?.length && this.isColoquentResource()) {
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

    private hadPreviousSelection(item: any): boolean {
        return !!this.originalItems?.find(element => this.compareWith(element, item));
    }

    private isColoquentResource() {
        const items = this.ngSelectComponent.itemsList.items;

        return items?.length && typeof items[0].value['getAttribute'] === 'function';
    }

    private canLoadItems(): boolean {
        return this.autoLoad || (!this.isDisabled && this.wasClicked);
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
