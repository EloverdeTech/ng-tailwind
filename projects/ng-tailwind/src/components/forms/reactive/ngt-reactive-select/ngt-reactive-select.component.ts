import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Injector,
    OnDestroy,
    Optional,
    Self,
    Signal,
    SkipSelf,
    TemplateRef,
    ViewChild,
    computed,
    effect,
    input,
    output,
    untracked,
} from '@angular/core';
import { ReactiveFormsModule, TouchedChangeEvent, ValidatorFn, ValueChangeEvent } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgOption, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subject, Subscription } from 'rxjs';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { NgtStylizableDirective } from '../../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtTranslateService } from '../../../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtReactiveSelectHeaderTemplate, NgtReactiveSelectOptionSelectedTemplate, NgtReactiveSelectOptionTemplate } from './ngt-reactive-select.directive';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtShiningModule } from '../../../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../../../ngt-svg/ngt-svg.module';
import { NgtReactiveSelectValidationService, NgtReactiveSelectValidationConfig } from './services/ngt-reactive-select-validation.service';
import { NgtReactiveSelectSearchService, NgtReactiveSelectSearchConfig } from './services/ngt-reactive-select-search.service';
import { NgtReactiveSelectDropdownService } from './services/ngt-reactive-select-dropdown.service';
import { NgtReactiveSelectStateService } from './services/ngt-reactive-select-state.service';
import { NgtReactiveSelectItemsConfig, NgtReactiveSelectItemsService } from './services/ngt-reactive-select-items.service';
import { NgtReactiveSelectTagManagerService } from './services/ngt-reactive-select-tag-manager.service';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

export enum NgtReactSelectDropdownPanelHeight {
    AUTO = 'auto',
    XS = 'xs',
    MD = 'md',
    SM = 'sm',
    LG = 'lg',
    XL = 'xl'
}

@Component({
    selector: 'ngt-reactive-select',
    templateUrl: './ngt-reactive-select.component.html',
    styleUrls: ['./ngt-reactive-select.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveSelectComponent),

        NgtReactiveSelectValidationService,
        NgtReactiveSelectSearchService,
        NgtReactiveSelectItemsService,
        NgtReactiveSelectDropdownService,
        NgtReactiveSelectStateService,
        NgtReactiveSelectTagManagerService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgtValidationModule,
        NgtShiningModule,
        NgtSvgModule,
        NgtHelperComponent,

        /** Directives */
        NgtReactiveSelectOptionTemplate,
        NgtReactiveSelectOptionSelectedTemplate,
        NgtReactiveSelectHeaderTemplate,
    ],
})
export class NgtReactiveSelectComponent extends NgtControlValueAccessor implements OnDestroy {
    @ViewChild(NgSelectComponent, { static: true }) public ngSelectComponent: NgSelectComponent;
    @ContentChild(NgtReactiveSelectOptionTemplate, { read: TemplateRef }) public ngtOptionTemplate: TemplateRef<any>;
    @ContentChild(NgtReactiveSelectOptionSelectedTemplate, { read: TemplateRef }) public ngtOptionSelectedTemplate: TemplateRef<any>;
    @ContentChild(NgtReactiveSelectHeaderTemplate, { read: TemplateRef }) public ngtSelectHeaderTemplate: TemplateRef<any>;

    /** Visual Inputs */

    public readonly label = input<string>('');
    public readonly labelIcon = input<string>();
    public readonly labelIconColor = input<string>();
    public readonly helpTitle = input<string>();
    public readonly helpText = input<string>();
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly shining = input<boolean>(false);
    public readonly loading = input<boolean>(false);
    public readonly loadingText = input<string>('');
    public readonly notFoundText = input<string>('');
    public readonly dropdownPosition = input<string>('auto');
    public readonly typeToSearchText = input<string>('');
    public readonly clearAllTooltip = input<string>('');
    public readonly placeholder = input<string>('');
    public readonly createText = input<string>('');
    public readonly labelForId = input<string>('');
    public readonly dropdownPanelMinHeight = input<NgtReactSelectDropdownPanelHeight>(NgtReactSelectDropdownPanelHeight.AUTO);
    public readonly helperReverseYPosition = input<boolean>(false);
    public readonly helperAutoXReverse = input<boolean>(true);

    /** Behavior Inputs */

    public readonly remoteResource = input<any>();
    public readonly items = input<Array<any> | Observable<any>>([]);
    public readonly bindLabel = input<string>('name');
    public readonly bindValue = input<string>();
    public readonly inputAttrs = input<{ [key: string]: string }>();
    public readonly groupBy = input<string | Function>(null);
    public readonly tabIndex = input<number>();
    public readonly groupValue = input<(groupKey: string, cildren: any[]) => Object>();
    public readonly trackByFn = input<(item: any) => any>();
    public readonly isAllowedToRemoveFn = input<(a: any) => boolean>();
    public readonly sortSelectedItemsFn = input<(a: any, b: any) => any>();
    public readonly autoLoad = input<boolean>(false);
    public readonly allowCreate = input<boolean | Promise<any> | Function>(false);
    public readonly allowOriginalItemsUnselect = input<boolean>(true);
    public readonly isDisabled = input<boolean>(false);
    public readonly isReadonly = input<boolean>(false);
    public readonly hideSelected = input<boolean>(false);
    public readonly closeOnSelect = input<boolean>(true);
    public readonly clearable = input<boolean>(true);
    public readonly multiple = input<boolean>(false);
    public readonly searchable = input<boolean>(true);
    public readonly clearSearchOnAdd = input<boolean>(true);
    public readonly virtualScroll = input<boolean>(true);
    public readonly guessCompareWith = input<boolean>(true);
    public readonly compareWith = input<(a: any, b: any) => boolean>((a: any, b: any) => a === b);
    public readonly autoSelectUniqueOption = input<boolean>(false);
    public readonly valueAsArray = input<boolean>(false);

    /** Validation Inputs */

    public readonly maxSelectedItems = input<number>();
    public readonly customSyncValidators = input<ValidatorFn[]>();
    public readonly isRequired = input<boolean>(false);

    /** Outputs */

    public readonly onLoadRemoteResource = output<any>();
    public readonly onSelectedItemRemove = output<any>();
    public readonly onClear = output<void>();
    public readonly onToggleDropdown = output<boolean>();
    public readonly onValueChange = output<any>();

    /** Computed Signals */

    public readonly isShining: Signal<boolean> = computed(
        () => this.shining() || this.ngtReactForm?.shining() || this.stateService.shining()
    );

    public readonly isLoading: Signal<boolean> = computed(
        () => this.loading() || this.stateService.loading()
    );

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtReactForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent() || this.isReadonly()
    );

    public readonly isClearable: Signal<boolean> = computed(
        () => {
            if (!this.multiple() && this.isRequired()) {
                return false;
            }

            return this.clearable();
        }
    );

    public readonly shouldCloseOnSelect: Signal<boolean> = computed(
        () => this.multiple() ? false : this.closeOnSelect()
    );

    public readonly selectClasses: Signal<string> = computed(() => this.buildSelectClasses());

    public readonly typeaheadSubject: Signal<Subject<any>> = computed(() => this.stateService.typeaheadSubject());

    /** Other Public Properties */

    public ngtStyle: NgtStylizableService;

    /** Private Properties */

    private nativeValue: any;
    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @Self()
        public ngtStylizableDirective: NgtStylizableDirective,

        @Optional()
        public ngtTranslateService: NgtTranslateService,

        @Optional() @SkipSelf()
        private ngtReactForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        private validationService: NgtReactiveSelectValidationService,
        private searchService: NgtReactiveSelectSearchService,
        private itemsService: NgtReactiveSelectItemsService,
        private dropdownService: NgtReactiveSelectDropdownService,
        private tagManagerService: NgtReactiveSelectTagManagerService,
        private changeDetector: ChangeDetectorRef,

        protected override injector: Injector,

        public stateService: NgtReactiveSelectStateService,
    ) {
        super();

        const initialItems = new Observable((observer) => {
            observer.next([]);
        });

        this.stateService.setNgSelectItems(initialItems);

        this.setupNgtStylizable();

        this.registerEffects();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        if (!this.getElementTitle() || this.getElementTitle() === 'null') {
            this.ngSelectComponent.element.parentElement.parentElement.parentElement.title = '';
        }

        if (this.formControl) {
            this.subscriptions.push(
                this.formControl.events.subscribe((event) => {
                    if (event instanceof TouchedChangeEvent) {
                        this.touched.set(event.touched);
                    }

                    if (event instanceof ValueChangeEvent) {
                        this.onValueChange.emit(event.value);
                    }

                    this.stateService.updateFormControlState(this.formControl);
                })
            );

            this.setupValidators();
        }
    }

    public ngOnDestroy(): void {
        this.searchService.clearSearchTimeout();
        this.destroySubscriptions();
    }

    public onOpen(): void {
        this.onToggleDropdown.emit(true);

        const parentElements = document.querySelectorAll('#ngtSelectParentContainer');

        if (this.dropdownPosition() === 'auto' && parentElements?.length) {
            const parentContainer = parentElements[parentElements.length - 1];

            this.calculateDropdownPosition(parentContainer);
        }
    }

    public onClose(): void {
        this.onToggleDropdown.emit(false);
    }

    public onClearSelect(): void {
        this.searchService.clearFilters();

        this.onClear.emit();
    }

    public onRemoveSelectedItem(removedItem: any): void {
        if (this.cantRemoveItem(removedItem)) {
            const compareWithFn = this.getCompareWith();

            const ngOption: NgOption = this.ngSelectComponent
                .itemsList
                .items
                .find(item => compareWithFn(item.value, removedItem));

            this.ngSelectComponent.select(ngOption);

            return;
        }

        this.onSelectedItemRemove.emit(removedItem);
    }

    public onScroll({ end }: { end: number }): void {
        this.searchService.handleScroll(
            end,
            () => this.loadRemoteData({})
        );
    }

    public onNativeChange(value: any): void {
        if (this.hasChangesBetweenValues(this.value, value)) {
            value = this.sortSelectedItems(value);

            if (this.valueAsArray() && !Array.isArray(value)) {
                value = [value];
            }

            this.nativeValue = value;
            this.value = value;
        }
    }

    public change(value: any): void {
        if (this.hasChangesBetweenValues(value, this.nativeValue)) {
            if (this.valueAsArray() && !Array.isArray(value)) {
                value = [value];
            }

            this.nativeValue = this.sortSelectedItems(value);

            this.changeDetector.detectChanges();

            const valueToNgSelect = !this.multiple() && this.valueAsArray() && this.nativeValue?.length
                ? this.nativeValue[0]
                : this.nativeValue;

            this.ngSelectComponent.writeValue(valueToNgSelect);
        }
    }

    public loadRemoteData(filters: any): void {
        const config: NgtReactiveSelectSearchConfig = {
            remoteResource: this.remoteResource(),
            guessCompareWith: this.guessCompareWith(),
            compareWith: this.compareWith(),
            autoSelectUniqueOption: this.autoSelectUniqueOption(),
            currentValue: this.value,
            ngSearchObserver: this.itemsService.getNgSearchObserver(),
            onNativeChange: this.onNativeChange,
            onLoadRemoteResource: this.onLoadRemoteResource
        };

        this.searchService.loadRemoteData(config, filters);
    }

    public removeItem(event: Event, item: any): void {
        event.preventDefault();
        event.stopPropagation();

        return this.ngSelectComponent.clearItem(item);
    }

    public refresh(): void {
        this.initNgSelectItems();

        this.setupValidators();
    }

    public reset(): void {
        this.value = undefined;
        this.nativeValue = undefined;
        this.refresh();
    }

    public itemSearchFn(): (term: string, item: any) => any {
        return this.searchService.itemSearchFn(this.remoteResource(), this.bindLabel());
    }

    public setFocus(): void {
        setTimeout(() => this.ngSelectComponent.focus());
    }

    public getFilterInputValue(): string {
        let inputField = this.ngSelectComponent.searchInput
            ? this.ngSelectComponent.searchInput
            : this.ngSelectComponent['searchInput'];

        if (inputField?.nativeElement) {
            return inputField.nativeElement.value;
        }
    }

    public getCompareWith(): (a: any, b: any) => boolean {
        return this.searchService.getCompareWithFn();
    }

    public hasSelectedValue(): string {
        return this.value && JSON.stringify(this.value);
    }

    public cantRemoveItem(itemValue: any): boolean {
        const isAllowedFn = this.isAllowedToRemoveFn();

        return (!this.allowOriginalItemsUnselect() && this.hadPreviousSelection(itemValue))
            || (isAllowedFn && !isAllowedFn(itemValue));
    }

    private initNgSelectItems(): void {
        const config: NgtReactiveSelectItemsConfig = {
            remoteResource: this.remoteResource(),
            items: this.items(),
            autoSelectUniqueOption: this.autoSelectUniqueOption(),
            guessCompareWith: this.guessCompareWith(),
            compareWith: this.getCompareWith(),
            currentValue: this.value,
            canLoadItems: this.canLoadItems(),
            ngSearchObserver: null,
            onNativeChange: (value: any) => this.onNativeChange(value),
            onLoadRemoteResource: this.onLoadRemoteResource,
        };

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

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const config: NgtReactiveSelectValidationConfig = {
            isRequired: this.isRequired(),
            customSyncValidators: this.customSyncValidators(),
        };

        const syncValidators = this.validationService.getSyncValidators(config);

        this.formControl.setValidators(syncValidators);
        this.formControl.updateValueAndValidity();

        if (this.value && (!Array.isArray(this.value) || this.value.length)) {
            this.markAsDirty();

            this.stateService.formControlHasErrors.set(!!this.formControl.errors);
            this.stateService.formControlIsDirty.set(true);
        }
    }

    private setupNgtStylizable(): void {
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

    private registerEffects(): void {
        effect(() => {
            const remoteResource = this.remoteResource();
            const itemsList = this.items();

            untracked(() => {
                if (remoteResource || itemsList) {
                    this.initNgSelectItems();
                }
            });
        });

        effect(() => {
            if (this.isRequired()) {
                this.setupValidators();
            }
        });

        effect(() => {
            if (!this.stateService.hadFirstItemsLoad() && this.canLoadItems() && this.ngSelectComponent) {
                this.stateService.markFirstItemsLoaded();

                this.initNgSelectItems();

                this.tagManagerService.replaceShowAddTag({
                    ngSelectComponent: this.ngSelectComponent,
                    bindLabel: this.bindLabel()
                });

                this.ngSelectComponent.itemsList.mapSelectedItems();

                const originalItems = this.ngSelectComponent.selectedItems?.map((element) => element.value);

                this.itemsService.setOriginalItems(originalItems ?? []);
            }
        });
    }

    private async calculateDropdownPosition(parentContainer: Element): Promise<void> {
        await this.dropdownService.calculateDropdownPosition(
            this.ngSelectComponent,
            parentContainer,
        );
    }

    private buildSelectClasses(): string {
        const minHeight = this.dropdownPanelMinHeight();

        let selectClass = minHeight ? `ng-select-dropdown-panel-${minHeight}` : 'ng-select-dropdown-panel-auto';

        if (this.isDisabledState()) {
            selectClass += ' select-border-disabled';
        } else if (this.stateService.formControlHasErrors() && (this.stateService.formControlIsDirty() || this.touched())) {
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

    private sortSelectedItems(value: any): any {
        return this.itemsService.sortSelectedItems(value, this.sortSelectedItemsFn());
    }

    private getElementTitle(): string {
        return this.ngSelectComponent.element.parentElement.parentElement.parentElement.title;
    }

    private hasChangesBetweenValues(a: any, b: any): boolean {
        return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
    }

    private hadPreviousSelection(item: any): boolean {
        const compareWithFn = this.getCompareWith();

        return this.itemsService.hadPreviousSelection(item, compareWithFn);
    }

    private canLoadItems(): boolean {
        return this.autoLoad() || (!this.isDisabledState() && this.stateService.wasClicked());
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
