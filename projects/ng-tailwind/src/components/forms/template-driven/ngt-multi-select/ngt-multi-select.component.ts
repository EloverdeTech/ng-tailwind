import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    Host,
    HostListener,
    Injector,
    input,
    OnDestroy,
    Optional,
    output,
    Self,
    Signal,
    signal,
    SkipSelf,
    TemplateRef,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { AbstractControl, ControlContainer, NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { uuid } from '../../../../helpers/uuid';
import { NgtHttpPagination, NgtHttpResponse, NgtHttpService } from '../../../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtInputComponent } from '../ngt-input/ngt-input.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtMultiSelectLoaderService } from './services/ngt-multi-select-loader.service';

@Component({
    selector: 'ngt-multi-select',
    templateUrl: './ngt-multi-select.component.html',
    styleUrls: ['./ngt-multi-select.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtMultiSelectComponent),
        NgtMultiSelectLoaderService,
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtMultiSelectComponent extends NgtControlValueAccessor implements AfterViewInit, OnDestroy {
    @ViewChild('containerRef') public containerRef: ElementRef;
    @ViewChild('inputSearch') public inputSearch: NgtInputComponent;
    @ViewChild('elementCheckboxTemplate') public elementCheckboxTemplate: TemplateRef<any>;

    /** Visual Inputs */

    public readonly customOptionTemplate = input<TemplateRef<any>>();
    public readonly customHeaderTemplate = input<TemplateRef<any>>();
    public readonly label = input<string>();
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly helperReverseYPosition = input<boolean>();
    public readonly helperAutoXReverse = input<boolean>(true);
    public readonly shining = input<boolean>(false);
    public readonly loading = input<boolean>(false);

    /** Behavior Inputs */

    public readonly bindLabel = input<string | Function>('name');
    public readonly bindSearch = input<string>('name');
    public readonly itemsPerPage = input<number>(15);
    public readonly name = input<string>();
    public readonly remoteResource = input<any>();
    public readonly items = input<Array<any>>([]);
    public readonly searchable = input<boolean>(true);
    public readonly allowOriginalItemsUnselect = input<boolean>(true);
    public readonly allowSelectAll = input<boolean>(true);
    public readonly allowDisplayOnlySelected = input<boolean>(true);
    public readonly autoSelectUniqueOption = input<boolean>();

    /** Validation Inputs */

    public readonly isRequired = input<boolean>();
    public readonly isDisabled = input<boolean>();

    /** Outputs */

    public readonly onDataChange = output<Array<NgtSelectContainerSelectableElementInterface>>();

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.loaderService.shining() || this.ngtForm?.isShining()
    );

    public readonly isLoading: Signal<boolean> = computed(
        () => this.loading() || this.loaderService.loading()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => !!(this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState())
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly currentSelectableElements: Signal<Array<NgtSelectContainerSelectableElementInterface>> = computed(() => {
        if (this.inSearch() && this.items()?.length) {
            return this.selectableElementsOnSearch();
        } else if (this.displayOnlySelected()) {
            return this.selectedElements();
        }

        return this.selectableElements();
    });

    public readonly hasNoData: Signal<boolean> = computed(
        () => !this.currentSelectableElements()?.length
    );

    public readonly hasValidationErrors: Signal<boolean> = computed(() => {
        const hasErrors = this.formControlHasErrors();
        const isDirty = this.formControlIsDirty();
        const isSubmitted = !!(this.formContainer && (this.formContainer as any)['submitted']);

        return hasErrors && (isDirty || isSubmitted);
    });

    public readonly containerClasses: Signal<string> = computed(() => {
        const classes = ['border w-full rounded', this.ngtStyle.compile(['h'])];

        if (this.hasValidationErrors()) {
            classes.push('border-red-500');
        }

        if (this.isDisabledState()) {
            classes.push('disabled-background');
        }

        return classes.join(' ');
    });

    public readonly selectedCount: Signal<number> = computed(
        () => this.selectedElements()?.length || 0
    );

    /** Writable Signals */

    public readonly selectableElements: WritableSignal<Array<NgtSelectContainerSelectableElementInterface>> = signal([]);
    public readonly selectableElementsOnSearch: WritableSignal<Array<NgtSelectContainerSelectableElementInterface>> = signal([]);
    public readonly selectedElements: WritableSignal<Array<NgtSelectContainerSelectableElementInterface>> = signal([]);
    public readonly componentReady: WritableSignal<boolean> = signal(false);
    public readonly searchTerm: WritableSignal<string> = signal('');
    // public readonly selectAllCheckbox: WritableSignal<boolean> = signal(false);
    // TODO: CHANGE THIS TO SIGNAL
    public selectAllCheckbox: boolean = false;
    public readonly displayOnlySelected: WritableSignal<boolean> = signal(false);
    public readonly itemsTotal: WritableSignal<number> = signal(0);

    /** Internal State */

    public readonly searchInputName: string = uuid();
    public readonly selectAllCheckboxName: string = uuid();
    public readonly displayOnlySelectedName: string = uuid();
    public ngtStyle: NgtStylizableService;

    private readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    private readonly formControlIsDirty: WritableSignal<boolean> = signal(false);
    private readonly inSearch: WritableSignal<boolean> = signal(false);
    private readonly currentItemsPerPage: WritableSignal<number> = signal(15);

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
    private searchSubject$ = new Subject<string>();
    private previousSearchTerm: string = '';
    private becameVisible: boolean = false;
    private selectableResourcesCount: number;
    private originalItems: Array<NgtSelectContainerSelectableElementInterface> = [];

    public constructor(
        private ngtHttpService: NgtHttpService,
        private cdr: ChangeDetectorRef,
        private loaderService: NgtMultiSelectLoaderService,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        @Optional() @Self()
        private ngtStylizableDirective: NgtStylizableDirective,

        protected override injector: Injector,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        super();

        this.setupNgtStylizable();
        this.registerEffects();
    }

    @HostListener('scroll', ['$event'])
    public onScroll(event: any): void {
        const isScrollEnd = event.target.scrollTop &&
            event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 30);

        if (
            isScrollEnd
            && !this.isLoading()
            && !this.displayOnlySelected()
            && this.selectableElements()?.length
            && this.pagination.per_page < this.pagination.total
        ) {
            const currentPerPage = typeof this.pagination.per_page === 'string'
                ? Number.parseInt(this.pagination.per_page)
                : this.pagination.per_page;

            setTimeout(() => this.loadData(currentPerPage + this.currentItemsPerPage(), this.searchTerm()));
        }
    }

    public ngAfterViewInit(): void {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name()) {
            console.error("The element must contain a name attribute!");
        }

        this.setupSearchSubscription();

        this.cdr.detach();
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
        this.searchSubject$.complete();
        this.cdr.reattach();
    }

    public setFocus(): void {
        setTimeout(() => this.inputSearch?.setFocus());
    }

    public async refresh(itemsPerPage?: number, searchTerm?: string): Promise<void> {
        if (itemsPerPage !== undefined) {
            this.currentItemsPerPage.set(itemsPerPage);
        }

        if (searchTerm !== undefined) {
            this.searchTerm.set(searchTerm);
        }

        return this.loadData(this.currentItemsPerPage(), this.searchTerm());
    }

    public reset(): void {
        this.value = [];
        this.selectedElements.set([]);
        this.refresh();
    }

    public selectAll(): void {
        if (this.allowSelectAll() && !this.isLoading() && !this.isDisabledState()) {
            const newSelectAllState = !this.selectAllCheckbox;

            this.selectAllCheckbox = newSelectAllState;

            this.value = [];
            this.selectedElements.set(this.allowOriginalItemsUnselect() ? [] : [...this.originalItems]);

            const perpage = newSelectAllState ? this.pagination.total : this.currentItemsPerPage();

            this.loadData(perpage, this.searchTerm())
                .then(() => {
                    this.containerRef?.nativeElement?.scrollTo({ top: 0 });

                    const updatedElements = this.selectableElements().map(element => ({
                        ...element,
                        isSelected: newSelectAllState || this.isSelectedElement(element)
                    }));

                    this.selectableElements.set(updatedElements);

                    if (newSelectAllState) {
                        this.selectedElements.set([...updatedElements]);
                    }

                    this.cdr.detectChanges();
                });
        }
    }

    public selectElements(elements: Array<any>): void {
        if (!this.isDisabledState()) {
            const elementIds = this.isColoquentResources() ? elements.map(element => element.getApiId()) : elements;

            const updatedElements = this.selectableElements().map(selectableElement => {
                const value = selectableElement.value;

                if (
                    !selectableElement.isSelected
                    && (
                        (this.isColoquentResources() && elementIds.includes(value.getApiId()))
                        || elementIds.includes(value)
                    )
                ) {
                    const updated = { ...selectableElement, isSelected: true };

                    this.handleElementSelection(updated);

                    return updated;
                }

                return selectableElement;
            });

            this.selectableElements.set(updatedElements);
            this.cdr.detectChanges();
        }
    }

    public toggleItem(selectableElement: NgtSelectContainerSelectableElementInterface, event?: Event): void {
        event?.stopImmediatePropagation();

        if (!this.isDisabledState() && this.canSelectItem(selectableElement)) {
            const updatedElement = { ...selectableElement, isSelected: !selectableElement.isSelected };

            this.updateSelectableElement(updatedElement);
            this.handleElementSelection(updatedElement);
            this.cdr.detectChanges();
        }
    }

    public onNativeChange(selectableElement: NgtSelectContainerSelectableElementInterface): void {
        if (this.componentReady()) {
            this.handleElementSelection(selectableElement);

            if (this.hasChangesBetweenBindings(this.value, this.selectedElements())) {
                this.value = this.selectedElements().map(e => e.value);
            }

            this.cdr.detectChanges();
        }
    }

    public change(selectedElements: Array<any>): void {
        if (this.hasChangesBetweenBindings(selectedElements, this.selectedElements())) {
            const currentSelectableElements = this.selectableElements();

            if (currentSelectableElements?.length) {
                this.bindSelectedElements(selectedElements);

                const updatedSelectableElements = currentSelectableElements.map(element => ({
                    ...element,
                    isSelected: this.isSelectedElement(element)
                }));

                this.selectableElements.set(updatedSelectableElements);

                const updatedSearchElements = this.selectableElementsOnSearch().map(element => ({
                    ...element,
                    isSelected: this.isSelectedElement(element)
                }));

                this.selectableElementsOnSearch.set(updatedSearchElements);
            } else {
                const newSelectedElements = selectedElements?.map(
                    element => ({ uuid: uuid(), isSelected: true, value: element })
                ) ?? [];

                this.selectedElements.set(newSelectedElements);
            }

            if (!selectedElements?.length) {
                this.markAsPristine();
            }

            this.cdr.detectChanges();
        }
    }

    public search(term: string): void {
        this.searchSubject$.next(term);
    }

    public getSelectableElementValue(selectableItem: NgtSelectContainerSelectableElementInterface): string {
        const bindLabelValue = this.bindLabel();

        if (typeof bindLabelValue === 'function') {
            return bindLabelValue(selectableItem.value);
        } else if (typeof selectableItem.value['getAttribute'] === 'function') {
            return selectableItem.value.getAttribute(bindLabelValue as string);
        }

        return selectableItem.value[bindLabelValue as string];
    }

    public canSelectItem(item: NgtSelectContainerSelectableElementInterface): boolean {
        return !this.isDisabledState()
            && (
                this.allowOriginalItemsUnselect()
                || !this.originalItems?.some(originalItem => originalItem.uuid === item.uuid)
            );
    }

    public trackByUuid(index: number, element: NgtSelectContainerSelectableElementInterface): string {
        return element.uuid;
    }

    private registerEffects(): void {
        effect(() => {
            const items = this.items();

            if (items?.length) {
                this.bindSelectableElements(items);
                this.componentReady.set(true);

                if (this.canAutoSelectUniqueOption()) {
                    const firstElement = this.selectableElements()[0];

                    if (firstElement) {
                        const updated = { ...firstElement, isSelected: true };

                        this.selectableElements.update(elements => {
                            const newElements = [...elements];

                            newElements[0] = updated;

                            return newElements;
                        });

                        this.onNativeChange(updated);
                    }
                }

                this.cdr.detectChanges();
            }
        });

        effect(() => {
            const remoteResource = this.remoteResource();

            if (remoteResource && this.becameVisible) {
                this.loadData().then(() => {
                    this.initComponentValidation();

                    if (this.canAutoSelectUniqueOption()) {
                        const firstElement = this.selectableElements()[0];

                        if (firstElement) {
                            const updated = { ...firstElement, isSelected: true };

                            this.selectableElements.update(elements => {
                                const newElements = [...elements];

                                newElements[0] = updated;

                                return newElements;
                            });

                            this.onNativeChange(updated);
                        }
                    }

                    this.cdr.detectChanges();
                });
            }
        });

        effect(() => {
            const isRequired = this.isRequired();

            if (this.componentReady()) {
                this.updateValidations();
                this.cdr.detectChanges();
            }
        });

        effect(() => {
            const isDisabled = this.isDisabled();

            this.displayOnlySelected.set(this.isDisabledState());
            this.cdr.detectChanges();
        });

        effect(() => {
            const newItemsPerPage = this.itemsPerPage();

            this.currentItemsPerPage.set(newItemsPerPage);
            this.pagination.per_page = newItemsPerPage;
        });

        effect(() => {
            if (!this.becameVisible && !this.isHidden()) {
                this.becameVisible = true;

                this.loadData().then(() => {
                    this.initComponentValidation();

                    if (this.canAutoSelectUniqueOption()) {
                        const firstElement = this.selectableElements()[0];

                        if (firstElement) {
                            const updated = { ...firstElement, isSelected: true };

                            this.selectableElements.update(elements => {
                                const newElements = [...elements];

                                newElements[0] = updated;

                                return newElements;
                            });

                            this.onNativeChange(updated);
                        }
                    }

                    this.originalItems = [...this.selectedElements()];
                    this.cdr.detectChanges();
                });
            }
        });
    }

    private setupSearchSubscription(): void {
        this.subscriptions.push(
            this.searchSubject$.pipe(
                debounceTime(500),
                distinctUntilChanged()
            ).subscribe(term => {
                this.performSearch(term);
            })
        );
    }

    private performSearch(term: string): void {
        if (!this.componentReady() || term === this.previousSearchTerm || this.isLoading()) {
            return;
        }

        this.previousSearchTerm = term;
        this.selectAllCheckbox = this.selectedElements()?.length === this.selectableResourcesCount;

        if (!term) {
            this.inSearch.set(false);

            if (this.items()?.length) {
                this.cdr.detectChanges();

                return;
            }
        }

        this.inSearch.set(true);

        if (this.items()?.length) {
            const normalizedTerm = term.toLowerCase().trim();

            const filteredElements = this.selectableElements().filter(item => {
                const value = String(this.getSelectableElementValue(item) ?? '').toLowerCase();

                return value.includes(normalizedTerm);
            });

            this.selectableElementsOnSearch.set(filteredElements);
            this.cdr.detectChanges();
        } else {
            this.loadData(this.currentItemsPerPage(), term);
        }
    }

    private handleElementSelection(selectableElement: NgtSelectContainerSelectableElementInterface): void {
        const currentSelected = this.selectedElements();

        if (selectableElement.isSelected && !this.isSelectedElement(selectableElement)) {
            this.selectedElements.set([...currentSelected, selectableElement]);
        } else if (!selectableElement.isSelected && this.isSelectedElement(selectableElement)) {
            const filtered = currentSelected.filter(
                selectedElement => selectedElement.uuid !== selectableElement.uuid
            );

            this.selectedElements.set(filtered);

            this.onNativeChange(selectableElement);

            if (this.displayOnlySelected() && !filtered.length) {
                this.displayOnlySelected.set(false);
            }
        }
    }

    private updateSelectableElement(updatedElement: NgtSelectContainerSelectableElementInterface): void {
        this.selectableElements.update(elements =>
            elements.map(el => el.uuid === updatedElement.uuid ? updatedElement : el)
        );

        this.selectableElementsOnSearch.update(elements =>
            elements.map(el => el.uuid === updatedElement.uuid ? updatedElement : el)
        );
    }

    private async loadData(perpage: number = this.currentItemsPerPage(), searchTerm?: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const resource = this.remoteResource();

            if (resource) {
                if (this.isLoading()) {
                    return resolve();
                }

                if (perpage === this.currentItemsPerPage()) {
                    this.containerRef?.nativeElement?.scrollTo({ top: 0 });
                }

                this.selectableElements.set([]);
                this.loaderService.setLoading(true);
                this.currentItemsPerPage.set(perpage);

                const pagination: NgtHttpPagination = { ...this.pagination, per_page: perpage };
                const filters = searchTerm ? { [this.bindSearch()]: searchTerm } : null;

                this.subscriptions.push(
                    this.ngtHttpService.get(resource, filters, pagination).subscribe({
                        next: (response: NgtHttpResponse) => {
                            this.bindSelectableElements(response.data);

                            this.pagination = response.meta.pagination;
                            this.itemsTotal.set(this.pagination.total);
                            this.loaderService.setLoading(false);

                            if (!this.selectableResourcesCount && !searchTerm) {
                                this.selectableResourcesCount = this.pagination.total;
                            }

                            this.onDataChange.emit(this.selectableElements());
                            this.componentReady.set(true);
                            this.cdr.detectChanges();

                            setTimeout(() => {
                                this.displayOnlySelected.set(this.isDisabledState());
                                this.cdr.detectChanges();
                            });

                            resolve();
                        },
                        error: (error) => {
                            console.error(error);
                            this.loaderService.setLoading(false);
                            this.cdr.detectChanges();

                            reject();
                        }
                    })
                );
            } else if (!this.items()?.length) {
                console.error('The property [remoteResource] needs to be present to be able to make remote search');
                resolve();
            } else {
                resolve();
            }
        });
    }

    private bindSelectableElements(data: Array<any>): void {
        const currentSelected = this.selectedElements();
        const formattedElements: Array<NgtSelectContainerSelectableElementInterface> = [];

        data.forEach(item => {
            const alreadySelected = this.findSelectedElement(item, currentSelected);

            if (alreadySelected) {
                formattedElements.push(alreadySelected);
            } else {
                formattedElements.push({ uuid: uuid(), isSelected: false, value: item });
            }
        });

        this.selectableElements.set(formattedElements);
    }

    private bindSelectedElements(selectedElements: Array<any>): void {
        const currentSelectableElements = this.selectableElements();
        const newSelectedElements: Array<NgtSelectContainerSelectableElementInterface> = [];

        currentSelectableElements.forEach(selectableElement => {
            const shouldBeSelected: boolean = !!selectedElements?.find(
                selectedElement => this.compareWith(selectedElement, selectableElement.value)
            );

            if (shouldBeSelected) {
                newSelectedElements.push({ ...selectableElement, isSelected: true });
            }
        });

        if (newSelectedElements.length > 0) {
            this.selectedElements.update(current => {
                const existingUuids = current.map(el => el.uuid);
                const toAdd = newSelectedElements.filter(el => !existingUuids.includes(el.uuid));

                return [...current, ...toAdd];
            });
        }
    }

    private initComponentValidation(): void {
        if (this.formContainer?.control && (this.formControl = this.formContainer.control.get(this.name()))) {
            this.formControl = this.formContainer.control.get(this.name());
            this.markAsPristine();
            this.updateValidations();
            this.setupFormControlSubscription();
        }
    }

    private setupFormControlSubscription(): void {
        if (this.formControl) {
            this.subscriptions.push(
                this.formControl.statusChanges.subscribe(() => {
                    this.formControlHasErrors.set(!!this.formControl?.errors);
                    this.formControlIsDirty.set(!!this.formControl?.dirty);
                    this.cdr.detectChanges();
                })
            );
        }
    }

    private updateValidations(): void {
        const syncValidators = [];

        if (this.isRequired()) {
            syncValidators.push(this.isRequiredValidator());
        }

        setTimeout(() => {
            if (this.formControl) {
                this.formControl.setValidators(syncValidators);
                this.formControl.updateValueAndValidity();
            }
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

    private findSelectedElement(item: any, selectedElements: Array<NgtSelectContainerSelectableElementInterface>): NgtSelectContainerSelectableElementInterface | undefined {
        return selectedElements.find(selectedElement => this.compareWith(selectedElement.value, item));
    }

    private compareWith(a: any, b: any): boolean {
        if (typeof a['getApiId'] === 'function' && typeof b['getApiId'] === 'function') {
            return a.getApiId() === b.getApiId();
        } else if (a.id && b.id) {
            return a.id === b.id;
        }

        return JSON.stringify(a) === JSON.stringify(b);
    }

    private hasChangesBetweenBindings(value: Array<any>, nativeValue: Array<NgtSelectContainerSelectableElementInterface>): boolean {
        let compareValue = nativeValue;

        if (value?.length && !value[0].uuid) {
            compareValue = nativeValue.map(element => element.value) as any;
        }

        return JSON.stringify(value) !== JSON.stringify(compareValue);
    }

    private isSelectedElement(selectableElement: NgtSelectContainerSelectableElementInterface): boolean {
        return !!this.selectedElements().find(selectedElement => selectedElement.uuid === selectableElement.uuid);
    }

    private canAutoSelectUniqueOption(): boolean {
        return this.autoSelectUniqueOption()
            && (!this.value || !this.value?.length)
            && this.selectableElements()?.length === 1;
    }

    private isHidden(): boolean {
        return !this.containerRef?.nativeElement?.offsetParent;
    }

    private isColoquentResources(): boolean {
        const elements = this.selectableElements();

        return elements?.length && typeof elements[0].value['getApiId'] === 'function';
    }

    private setupNgtStylizable(): void {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtMultiSelect', { h: 'h-64' });
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
