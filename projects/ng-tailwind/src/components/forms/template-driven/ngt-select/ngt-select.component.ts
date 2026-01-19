import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Host,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Self,
    SkipSelf,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
    computed,
    effect,
    input,
    output,
    signal,
    untracked,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { NgOption, NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Subject, Unsubscribable } from 'rxjs';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { getEnumFromString } from '../../../../helpers/enum/enum';
import { uuid } from '../../../../helpers/uuid';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtSelectHeaderTmp, NgtSelectOptionSelectedTmp, NgtSelectOptionTmp } from './ngt-select.directive';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtSelectDropdownService } from './services/ngt-select-dropdown.service';
import { NgtSelectItemsConfig, NgtSelectItemsService } from './services/ngt-select-items.service';
import { NgtSelectSearchConfig } from './services/ngt-select-search.config';
import { NgtSelectSearchService } from './services/ngt-select-search.service';
import { NgtSelectStateService } from './services/ngt-select-state.service';
import { NgtSelectTagManagerService } from './services/ngt-select-tag-manager.service';
import { NgtSelectValidationConfig, NgtSelectValidationService } from './services/ngt-select-validation.service';

export enum NgtSelectDropdownPanelHeight {
    AUTO = 'auto',
    XS = 'xs',
    MD = 'md',
    SM = 'sm',
    LG = 'lg',
    XL = 'xl'
}

@Component({
    selector: 'ngt-select',
    templateUrl: './ngt-select.component.html',
    styleUrls: ['./ngt-select.component.css'],
    providers: [
        NgtValueAccessorProvider(NgtSelectComponent),

        NgtSelectValidationService,
        NgtSelectSearchService,
        NgtSelectItemsService,
        NgtSelectDropdownService,
        NgtSelectStateService,
        NgtSelectTagManagerService,
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtSelectComponent extends NgtControlValueAccessor implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(NgSelectComponent, { static: true }) public ngSelectComponent: NgSelectComponent;
    @ContentChild(NgtSelectOptionTmp, { read: TemplateRef }) public ngtOptionTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectOptionSelectedTmp, { read: TemplateRef }) public ngtOptionSelectedTemplate: TemplateRef<any>;
    @ContentChild(NgtSelectHeaderTmp, { read: TemplateRef }) public ngtSelectHeaderTemplate: TemplateRef<any>;

    /** Visual */

    public readonly label = input<string>('');
    public readonly labelIcon = input<string>();
    public readonly labelIconColor = input<string>();
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly shining = input<boolean>(false);
    // public readonly loading = input<boolean>(false);
    public readonly loadingText = input<string>('');
    public readonly notFoundText = input<string>('');
    public readonly dropdownPosition = input<string>('auto');
    public readonly typeToSearchText = input<string>('');
    public readonly clearAllTooltip = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly createText = input<string>('');
    public readonly labelForId = input<string>('');
    public readonly dropdownPanelMinHeight = input<NgtSelectDropdownPanelHeight | string>(NgtSelectDropdownPanelHeight.AUTO);
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly helperAutoXReverse = input<boolean>(true);

    @Input() public loading: boolean = false;

    /** Behavior */

    @Input() public remoteResource: any;

    public readonly name = input<string>();
    public readonly autoLoad = input<boolean>(false);
    public readonly allowCreate = input<boolean | Promise<any> | Function>(false);
    public readonly allowOriginalItemsUnselect = input<boolean>(true);
    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    // public readonly remoteResource = input<any>();
    public readonly hideSelected = input<boolean>(false);
    public readonly bindLabel = input<string>('name');
    public readonly bindValue = input<string>();
    public readonly items = input<Array<any> | Observable<any>>([]);
    public readonly inputAttrs = input<{ [key: string]: string }>();
    public readonly closeOnSelect = input<boolean>(true);
    public readonly clearable = input<boolean>(true);
    public readonly groupBy = input<string | Function>(null);
    public readonly maxSelectedItems = input<number>();
    public readonly multiple = input<boolean>(false);
    public readonly searchable = input<boolean>(true);
    public readonly clearSearchOnAdd = input<boolean>(true);
    public readonly virtualScroll = input<boolean>(true);
    public readonly tabIndex = input<number>();
    public readonly typeahead = input<Subject<any>>();
    public readonly guessCompareWith = input<boolean>(true);
    public readonly compareWith = input<(a: any, b: any) => boolean>((a: any, b: any) => a === b);
    public readonly autoSelectUniqueOption = input<boolean>(false);
    public readonly groupValue = input<(groupKey: string, cildren: any[]) => Object>();
    public readonly trackBy = input<(item: any) => any>();
    public readonly sortSelectedItemsFn = input<(a: any, b: any) => any>();
    public readonly isAllowedToRemoveFn = input<(a: any) => boolean>();

    /** Validation */

    public readonly isRequired = input<boolean>(false);

    public readonly onLoadRemoteResource = output<any>();
    public readonly onSelectedItemRemove = output<any>();
    public readonly onClear = output<void>();
    public readonly onClose = output<void>();

    public nativeName = uuid();
    public ngtStyle: NgtStylizableService;

    public readonly componentReady = signal<boolean>(false);

    public readonly isShining = computed(() => this.shining() || this.ngtForm?.isShining());
    public readonly isLoading = computed(() => this.loading || this.stateService.loading());

    public readonly isDisabledByParent = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState = computed(
        () => this.isDisabled() || this.isDisabledByParent() || this.isReadonly()
    );

    public readonly isClearable = computed(
        () => (!this.multiple() && this.isRequired()) ? false : this.clearable()
    );

    public readonly shouldCloseOnSelect = computed(
        () => this.multiple() ? false : this.closeOnSelect()
    );

    public readonly dropdownPanelMinHeightResolved = computed(
        () => getEnumFromString(this.dropdownPanelMinHeight(), NgtSelectDropdownPanelHeight)
    );

    public readonly selectClass = computed(() => this.buildSelectClass());
    public readonly typeaheadSubject = computed(() => this.stateService.typeaheadSubject());

    private readonly nativeValueSignal = signal<any>(undefined);
    private subscriptions: Array<Unsubscribable> = [];

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional()
        public ngtTranslateService: NgtTranslateService,

        private changeDetector: ChangeDetectorRef,

        private validationService: NgtSelectValidationService,
        private searchService: NgtSelectSearchService,
        private itemsService: NgtSelectItemsService,
        private dropdownService: NgtSelectDropdownService,
        private tagManagerService: NgtSelectTagManagerService,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        protected override injector: Injector,

        public stateService: NgtSelectStateService,
    ) {
        super();

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

        const initialItems = new Observable((observer) => {
            observer.next([]);
        });

        this.stateService.setNgSelectItems(initialItems);

        this.registerEffects();
    }

    public get nativeValue(): any {
        return this.nativeValueSignal();
    }

    public set nativeValue(value: any) {
        this.nativeValueSignal.set(value);
    }

    public ngOnInit() {
        if (!this.formContainer) {
            console.error("The element must be inside a <form #form='ngForm'> tag!");
        }

        if (!this.name()) {
            console.error("The element must contain a name attribute!");
        }

        setTimeout(() => {
            this.componentReady.set(true);
            this.initComponentValidation();
        }, 500);
    }

    public markClicked(): void {
        this.stateService.markAsClicked();
    }

    public ngAfterViewInit(): void {
        this.bindInnerInputUniqueId();
    }

    public ngOnDestroy() {
        this.searchService.clearSearchTimeout();

        this.destroySubscriptions();
    }

    public onOpen(): void {
        const parentElements = document.querySelectorAll('#ngtSelectParentContainer');

        if (this.dropdownPosition() === 'auto' && parentElements?.length) {
            const parentContainer = parentElements[parentElements.length - 1];

            this.calculateDropdownPosition(parentContainer);
        }
    }

    public handleClose(): void {
        this.onClose.emit();
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

    public setFocus() {
        setTimeout(() => {
            this.ngSelectComponent.focus();
        });
    }

    public onClearSelect() {
        if (!this.nativeValueSignal()) {
            this.markAsPristine();
        }

        this.searchService.clearFilters();

        this.onClear.emit();
    }

    public onRemoveSelectedItem(item: NgOption) {
        if (this.cantRemoveItem(item.value)) {
            setTimeout(() => this.ngSelectComponent.select(item));

            return;
        }

        this.onSelectedItemRemove.emit(item.value);
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

    public itemSearchFn(): (term: string, item: any) => any {
        return this.searchService.itemSearchFn(this.remoteResource, this.bindLabel());
    }

    public getCompareWith(): (a: any, b: any) => boolean {
        return this.searchService.getCompareWithFn();
    }

    public loadRemoteData(filters: any): void {
        const config: NgtSelectSearchConfig = {
            remoteResource: this.remoteResource,
            guessCompareWith: this.guessCompareWith(),
            compareWith: this.compareWith(),
            autoSelectUniqueOption: this.autoSelectUniqueOption(),
            currentValue: this.value,
            ngSearchObserver: this.itemsService.getNgSearchObserver(),
            onNativeChange: (value: any) => this.onNativeChange(value),
            onLoadRemoteResource: this.onLoadRemoteResource,
        };

        this.searchService.loadRemoteData(config, filters);
    }

    public onNativeChange(value): void {
        if (this.hasChangesBetweenModels(this.value, value)) {
            this.value = this.sortSelectedItems(value);
        }
    }

    public change(value): void {
        if (this.hasChangesBetweenModels(value, this.nativeValue)) {
            if (Array.isArray(value)) {
                value = value.map((val) => val);
            }

            this.nativeValue = this.sortSelectedItems(value);

            if (!value) {
                this.markAsPristine();
            }
        }
    }

    public onScroll({ end }) {
        this.searchService.handleScroll(end, () => this.loadRemoteData({}));
    }

    public hasSelectedValue() {
        return this.value && JSON.stringify(this.value);
    }

    public cantRemoveItem(itemValue: any): boolean {
        const isAllowedFn = this.isAllowedToRemoveFn();

        return (!this.allowOriginalItemsUnselect() && this.hadPreviousSelection(itemValue))
            || (isAllowedFn && !isAllowedFn(itemValue));
    }

    private async calculateDropdownPosition(parentContainer: Element): Promise<void> {
        await this.dropdownService.calculateDropdownPosition(
            this.ngSelectComponent,
            parentContainer,
        );
    }

    private initNgSelectItems(): void {
        const config: NgtSelectItemsConfig = {
            remoteResource: this.remoteResource,
            items: this.items(),
            autoSelectUniqueOption: this.autoSelectUniqueOption(),
            guessCompareWith: this.guessCompareWith(),
            compareWith: this.compareWith(),
            currentValue: this.value,
            canLoadItems: this.canLoadItems(),
            ngSearchObserver: null,
            onNativeChange: (value: any) => this.onNativeChange(value),
            onLoadRemoteResource: this.onLoadRemoteResource,
        };

        const externalTypeahead = this.typeahead();

        if (externalTypeahead) {
            this.stateService.setTypeaheadSubject(externalTypeahead);
        }

        const ngSelectItems = this.itemsService.initializeItems(config);

        if (config.remoteResource && config.canLoadItems) {
            const typeaheadSubject = this.itemsService.getTypeaheadSubject();

            this.stateService.setTypeaheadSubject(typeaheadSubject);

            this.subscriptions.push(
                typeaheadSubject.subscribe((term) => {
                    this.loadRemoteData({ term: term });
                })
            );
        }

        this.stateService.setNgSelectItems(ngSelectItems);
    }

    private initComponentValidation() {
        const controlName = this.name();

        if (this.formContainer && this.formContainer.control && controlName && (this.formControl = this.formContainer.control.get(controlName))) {
            this.formControl = this.formContainer.control.get(controlName);
            this.markAsPristine();
            this.updateValidations();
            this.bindFormStateUpdates();
        }
    }

    private sortSelectedItems(value: any): any {
        return this.itemsService.sortSelectedItems(value, this.sortSelectedItemsFn());
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

        const config: NgtSelectValidationConfig = {
            isRequired: this.isRequired(),
            multiple: this.multiple(),
        };

        const syncValidators = this.validationService.getSyncValidators(config);

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private replaceShowAddTag(): void {
        this.tagManagerService.replaceShowAddTag({
            ngSelectComponent: this.ngSelectComponent,
            bindLabel: this.bindLabel(),
        });
    }

    private bindInnerInputUniqueId() {
        const childInputs = this.ngSelectComponent.element.getElementsByTagName('input');

        if (childInputs?.length) {
            const innerInput = childInputs[0];

            innerInput.id = uuid();
        }
    }

    private hadPreviousSelection(item: any): boolean {
        return this.itemsService.hadPreviousSelection(item, this.getCompareWith());
    }

    private canLoadItems(): boolean {
        return this.autoLoad() || (!this.isDisabledState() && this.stateService.wasClicked());
    }

    private buildSelectClass(): string {
        const minHeight = this.dropdownPanelMinHeightResolved();
        let selectClass = minHeight ? `ng-select-dropdown-panel-${minHeight}` : 'ng-select-dropdown-panel-auto';

        if (this.isDisabledState()) {
            selectClass += ' select-border-disabled';
        } else if (this.stateService.formControlHasErrors()
            && (this.stateService.formControlIsDirty() || this.stateService.formSubmitted())) {
            selectClass += ' select-border-error';
        } else {
            selectClass += ' select-border-normal';
        }

        if (this.multiple()) {
            selectClass += ` h-auto ${this.ngtStyle.compile(['color.bg', 'color.text'])}`;
        } else {
            selectClass += ` ${this.ngtStyle.compile(['h', 'color.bg', 'color.text'])}`;
        }

        return selectClass;
    }

    private bindFormStateUpdates(): void {
        if (!this.formControl) {
            return;
        }

        this.updateFormState();

        this.subscriptions.push(
            this.formControl.statusChanges.subscribe(() => this.updateFormState())
        );

        this.subscriptions.push(
            this.formControl.valueChanges.subscribe(() => this.updateFormState())
        );

        const form = this.formContainer as NgForm;

        if (form?.ngSubmit) {
            this.subscriptions.push(
                form.ngSubmit.subscribe(() => this.updateFormState(true))
            );
        }
    }

    private updateFormState(forceSubmitted = false): void {
        this.stateService.updateFormControlState(
            this.formControl,
            forceSubmitted || !!(this.formContainer as any)?.submitted
        );

        this.changeDetector.markForCheck();
    }

    private registerEffects(): void {
        effect(() => {
            const compareWithInput = this.compareWith();

            untracked(() => this.searchService.setCompareWithFn(compareWithInput));
        });

        effect(() => {
            const isRequired = this.isRequired();
            const multiple = this.multiple();
            const controlName = this.name();
            const ready = this.componentReady();

            void isRequired;
            void multiple;

            untracked(() => {
                if (ready && controlName) {
                    this.updateValidations();
                }
            });
        });

        effect(() => {
            const remoteResource = this.remoteResource;
            const items = this.items();

            untracked(() => {
                if (remoteResource || items) {
                    this.initNgSelectItems();
                }
            });
        });

        effect(() => {
            if (!this.stateService.hadFirstItemsLoad() && this.canLoadItems() && this.ngSelectComponent) {
                this.stateService.markFirstItemsLoaded();

                this.initNgSelectItems();

                setTimeout(() => {
                    this.replaceShowAddTag();

                    this.ngSelectComponent.itemsList.mapSelectedItems();

                    if (!this.getElementTitle() || this.getElementTitle() === 'null') {
                        this.ngSelectComponent.element.parentElement.parentElement.parentElement.title = '';
                    }

                    const originalItems = this.ngSelectComponent.selectedItems?.map((element) => element.value);

                    this.itemsService.setOriginalItems(originalItems ?? []);

                    this.changeDetector.markForCheck();
                }, 500);
            }
        });
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
