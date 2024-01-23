import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Host,
    HostListener,
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
import { Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { uuid } from '../../helpers/uuid';
import { NgtHttpPagination, NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtInputComponent } from '../ngt-input/ngt-input.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';

@Component({
    selector: 'ngt-multi-select',
    templateUrl: './ngt-multi-select.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ngt-multi-select.component.css'],
    providers: [
        NgtMakeProvider(NgtMultiSelectComponent)
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtMultiSelectComponent extends NgtBaseNgModel implements OnInit, OnDestroy, OnChanges {
    @ViewChild('containerRef') public containerRef: ElementRef;
    @ViewChild('inputSearch') public inputSearch: NgtInputComponent;
    @ViewChild('elementCheckboxTemplate') public elementCheckboxTemplate: TemplateRef<any>;

    /** Visual */
    @Input() public customOptionTemplate: TemplateRef<any>;
    @Input() public customHeaderTemplate: TemplateRef<any>;
    @Input() public label: string;
    @Input() public helpTitle: string;
    @Input() public helpText: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helperReverseYPosition: boolean;
    @Input() public helperAutoXReverse: boolean = true;
    @Input() public shining: boolean = false;
    @Input() public loading: boolean = false;

    /** Behavior */
    @Input() public bindLabel: string | Function = 'name';
    @Input() public bindSearch: string = 'name';
    @Input() public itemsPerPage: number = 15;
    @Input() public name: string;
    @Input() public remoteResource: any;
    @Input() public items: Array<any> = [];
    @Input() public searchable: boolean = true;

    /** Validation */
    @Input() public isRequired: boolean;
    @Input() public isDisabled: boolean;

    @Output() public onDataChange: EventEmitter<Array<NgtSelectContainerSelectableElementInterface>> = new EventEmitter();

    public searchTerm: string = '';
    public searchInputName: string = uuid();

    public selectAllCheckboxName: string = uuid();
    public displayOnlySelectedName: string = uuid();

    public selectedElements: Array<NgtSelectContainerSelectableElementInterface> = [];
    public itemsTotal: number;
    public selectAllCheckbox: boolean;
    public displayOnlySelected: boolean;

    public nativeName: string = uuid();
    public nativeValue: any;

    public ngtStyle: NgtStylizableService;
    public selectableElements: Array<NgtSelectContainerSelectableElementInterface> = [];
    public selectableElementsOnSearch: Array<NgtSelectContainerSelectableElementInterface> = [];
    public componentReady: boolean;

    private pagination: NgtHttpPagination = {
        count: null,
        page: 1,
        pages: null,
        total: null,
        from: null,
        to: null,
        per_page: null
    };

    private subscriptions: Array<Subscription> = [];
    private inSearch: boolean;
    private searchTimeout: any;
    private previousSearchTerm: string = '';
    private becameVisible: boolean;
    private selectableResourcesCount: number;

    public constructor(
        private ngtHttpService: NgtHttpService,
        private injector: Injector,
        private changeDetector: ChangeDetectorRef,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        super();

        if (this.ngtForm) {
            this.shining = this.ngtForm.isShining();

            this.subscriptions.push(
                this.ngtForm.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtMultiSelect', { h: 'h-64' });
    }

    @HostListener('scroll', ['$event'])
    public onScroll(event: any): void {
        const isScrollEnd = event.target.scrollTop && event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 30);

        if (isScrollEnd && !this.loading && !this.displayOnlySelected && this.selectableElements?.length
            && this.pagination.per_page < this.pagination.total) {
            const currentPerPage = typeof this.pagination.per_page === 'string'
                ? Number.parseInt(this.pagination.per_page)
                : this.pagination.per_page;

            setTimeout(() => this.loadData(currentPerPage + this.itemsPerPage, this.searchTerm));
        }
    }

    public ngOnInit(): void {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name) {
            console.error("The element must contain a name attribute!");
        }
    }

    public ngDoCheck(): void {
        if (!this.becameVisible && !this.isHidden()) {
            this.becameVisible = true;

            this.loadData().then(() => this.initComponentValidation());
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isRequired && this.componentReady) {
            this.updateValidations();
        }

        if (changes.isDisabled) {
            this.displayOnlySelected = this.disabled();
        }

        if (changes.items) {
            this.bindSelectableElements(changes.items.currentValue);
            this.componentReady = true;
        }

        if (changes.remoteResource && this.becameVisible) {
            this.loadData().then(() => this.initComponentValidation());
        }

        if (changes.itemsPerPage) {
            this.pagination.per_page = changes.itemsPerPage.currentValue;
        }
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public setFocus(): void {
        setTimeout(() => this.inputSearch.setFocus());
    }

    public async refresh(itemsPerPage?: number, searchTerm?: string): Promise<void> {
        this.itemsPerPage = itemsPerPage !== undefined ? itemsPerPage : this.itemsPerPage;
        this.searchTerm = searchTerm !== undefined ? searchTerm : this.searchTerm;

        return this.loadData(this.itemsPerPage, this.searchTerm);
    }

    public reset(): void {
        this.value = [];
        this.nativeValue = [];
        this.selectedElements = [];
        this.refresh();
    }

    public selectAll(): void {
        if (!this.loading && !this.disabled()) {
            this.selectAllCheckbox = !this.selectAllCheckbox;

            this.value = [];
            this.nativeValue = [];
            this.selectedElements = [];

            const perpage = this.selectAllCheckbox ? this.pagination.total : this.itemsPerPage;

            this.loadData(perpage, this.searchTerm)
                .then(() => {
                    this.containerRef?.nativeElement?.scrollTo({ top: 0 });
                    this.selectableElements.forEach(element => element.isSelected = this.selectAllCheckbox);

                    if (this.selectAllCheckbox) {
                        this.selectedElements = this.selectableElements;
                    }
                });
        }
    }

    public selectElements(elements: Array<any>): void {
        if (!this.disabled()) {
            const elementIds = this.isColoquentResources() ? elements.map(element => element.getApiId()) : elements;

            this.selectableElements.forEach(
                (selectableElement: NgtSelectContainerSelectableElementInterface) => {
                    const value = selectableElement.value;

                    if (
                        !selectableElement.isSelected
                        && (
                            (this.isColoquentResources() && elementIds.includes(value.getApiId()))
                            || elementIds.includes(value)
                        )
                    ) {
                        selectableElement.isSelected = true;

                        this.handleElementSelection(selectableElement);
                    }
                }
            );
        }
    }

    public toggleItem(selectableElement: NgtSelectContainerSelectableElementInterface, event?: Event): void {
        event?.stopImmediatePropagation();

        if (!this.disabled()) {
            selectableElement.isSelected = !selectableElement.isSelected;

            this.handleElementSelection(selectableElement);
        }
    }

    public onNativeChange(selectableElement: NgtSelectContainerSelectableElementInterface): void {
        if (this.componentReady) {
            this.handleElementSelection(selectableElement);

            if (this.hasChangesBetweenBindings(this.value, this.selectedElements)) {
                this.value = this.selectedElements.map(e => e.value);
            }
        }
    }

    public change(selectedElements: Array<any>): void {
        if (this.hasChangesBetweenBindings(selectedElements, this.selectedElements)) {
            if (this.selectableElements?.length) {
                this.bindSelectedElements(selectedElements);

                this.selectableElements.filter(element => this.isSelectedElement(element))
                    .forEach(element => element.isSelected = true);

                this.selectableElementsOnSearch.filter(element => this.isSelectedElement(element))
                    .forEach(element => element.isSelected = true);
            } else {
                this.selectedElements = selectedElements?.map(
                    element => ({ uuid: uuid(), isSelected: true, value: element })
                ) ?? [];

                this.changeDetector.detectChanges();
            }

            if (!selectedElements?.length) {
                this.markAsPristine();
            }
        }
    }

    public search(term: string): void {
        if (!this.componentReady || term === undefined || term === null || term === this.previousSearchTerm || this.loading) {
            return;
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.previousSearchTerm = term;
            this.selectAllCheckbox = this.selectedElements?.length == this.selectableResourcesCount;

            if (!term) {
                this.inSearch = false;

                if (this.items?.length) {
                    return;
                }
            }

            this.inSearch = true;

            if (this.items?.length) {
                this.selectableElementsOnSearch = this.selectableElements.filter(
                    item => this.getSelectableElementValue(item).includes(term)
                );
            } else {
                this.loadData(this.itemsPerPage, term);
            }
        }, 500);
    }

    public getSelectableElements(): Array<any> {
        if (this.inSearch && this.items?.length) {
            return this.selectableElementsOnSearch;
        } else if (this.displayOnlySelected) {
            return this.selectedElements;
        }

        return this.selectableElements;
    }

    public getSelectableElementValue(selectableItem: any): string {
        if (typeof this.bindLabel === 'function') {
            return this.bindLabel(selectableItem.value);
        } else if (typeof selectableItem.value['getAttribute'] === 'function') {
            return selectableItem.value.getAttribute(this.bindLabel);
        }

        return selectableItem.value[this.bindLabel];
    }

    public hasValidationErrors(): boolean {
        return this.formControl?.errors && (
            this.formControl.dirty || (this.formContainer && this.formContainer['submitted'])
        );
    }

    public disabled(): boolean {
        return this.isDisabled || this.isDisabledByParent();
    }

    private handleElementSelection(selectableElement: NgtSelectContainerSelectableElementInterface): void {
        if (selectableElement.isSelected && !this.isSelectedElement(selectableElement)) {
            this.selectedElements.push(selectableElement);
        } else if (!selectableElement.isSelected && this.isSelectedElement(selectableElement)) {
            this.selectedElements = this.selectedElements.filter(
                selectedElement => selectedElement.uuid !== selectableElement.uuid
            );

            this.onNativeChange(selectableElement);

            if (this.displayOnlySelected && !this.selectedElements.length) {
                this.displayOnlySelected = false;
            }
        }
    }

    private async loadData(perpage: number = this.itemsPerPage, searchTerm?: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.remoteResource) {
                if (this.loading) {
                    return resolve();
                }

                if (perpage == this.itemsPerPage) {
                    this.containerRef?.nativeElement?.scrollTo({ top: 0 });
                }

                this.selectableElements = [];
                this.loading = true;
                this.itemsPerPage = perpage;

                const pagination: NgtHttpPagination = { ...this.pagination, ...{ per_page: perpage } };
                const filters = searchTerm ? { [this.bindSearch]: searchTerm } : null;

                this.subscriptions.push(
                    this.ngtHttpService.get(
                        this.remoteResource, filters, pagination
                    ).subscribe(
                        (response: NgtHttpResponse) => {
                            this.bindSelectableElements(response.data);

                            this.pagination = response.meta.pagination;
                            this.itemsTotal = this.pagination.total;
                            this.loading = false;

                            if (!this.selectableResourcesCount && !searchTerm) {
                                this.selectableResourcesCount = this.pagination.total;
                            }

                            this.onDataChange.emit(this.selectableElements);
                            this.componentReady = true;
                            this.changeDetector.detectChanges();

                            setTimeout(() => this.displayOnlySelected = this.disabled());

                            resolve();
                        },
                        (error) => {
                            console.error(error);
                            this.loading = false;
                            this.changeDetector.detectChanges();

                            reject();
                        }
                    )
                );
            } else {
                console.error('The property [remoteResource] needs to be present to be able to make remote search');
            }
        });
    }

    private bindSelectableElements(data: Array<any>): void {
        const formattedElements: Array<NgtSelectContainerSelectableElementInterface> = [];

        data.forEach(item => {
            const alreadySelected = this.findSelectedElement(item);

            if (alreadySelected) {
                formattedElements.push(alreadySelected);
            } else {
                formattedElements.push({ uuid: uuid(), isSelected: false, value: item });
            }
        });

        this.selectableElements = formattedElements;
    }

    private bindSelectedElements(selectedElements: Array<any>): void {
        this.selectableElements.forEach(selectableElement => {
            const shouldBeSelected: boolean = !!selectedElements?.find(
                selectedElement => this.compareWith(selectedElement, selectableElement.value)
            );

            if (shouldBeSelected) {
                selectableElement.isSelected = true;
                this.handleElementSelection(selectableElement);
            }
        });
    }

    private initComponentValidation(): void {
        if (this.formContainer?.control && (this.formControl = this.formContainer.control.get(this.name))) {
            this.formControl = this.formContainer.control.get(this.name);
            this.markAsPristine();
            this.updateValidations();
        }
    }

    private updateValidations(): void {
        const syncValidators = [];

        if (this.isRequired) {
            syncValidators.push(this.isRequiredValidator());
        }

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private isRequiredValidator(): any {
        return (control: AbstractControl) => {
            if (Array.isArray(this.value) && this.value.length > 0) {
                return null;
            }

            return { 'required': true };
        };
    }

    private findSelectedElement(item: any): any {
        return this.selectedElements.find(selectedElement => this.compareWith(selectedElement.value, item));
    }

    private compareWith(a: any, b: any): boolean {
        if (typeof a['getApiId'] === 'function' && typeof b['getApiId'] === 'function') {
            return a.getApiId() == b.getApiId();
        } else if (a.id && b.id) {
            return a.id == b.id;
        }

        return JSON.stringify(a) === JSON.stringify(b);
    }

    private hasChangesBetweenBindings(value: Array<any>, nativeValue: Array<any>): boolean {
        if (value?.length && !value[0].uuid) {
            nativeValue = nativeValue.map(element => element.value);
        }

        return JSON.stringify(value) !== JSON.stringify(nativeValue);
    }

    private isSelectedElement(selectableElement: NgtSelectContainerSelectableElementInterface): boolean {
        return !!this.selectedElements.find(selectedElement => selectedElement.uuid === selectableElement.uuid);
    }

    private isHidden(): boolean {
        return !this.containerRef?.nativeElement.offsetParent;
    }

    private isColoquentResources(): boolean {
        return this.selectableElements?.length && typeof this.selectableElements[0].value['getApiId'] === 'function';
    }

    private isDisabledByParent(): boolean {
        return this.ngtForm?.isDisabled
            || this.ngtSection?.isDisabled
            || this.ngtModal?.isDisabled;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export interface NgtSelectContainerSelectableElementInterface {
    uuid: string;
    isSelected: boolean;
    value: any;
}
