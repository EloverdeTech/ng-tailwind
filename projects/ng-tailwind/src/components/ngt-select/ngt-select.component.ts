import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Host,
  Injector,
  Input,
  OnChanges,
  Optional,
  Self,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlContainer, NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable, Observer, Subject } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { uuid } from '../../helpers/uuid';
import { NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
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
export class NgtSelectComponent extends NgtBaseNgModel implements OnChanges {

  @ContentChild(NgtSelectOptionTmp, { static: false, read: TemplateRef }) ngtOptionTemplate: TemplateRef<any>;
  @ContentChild(NgtSelectOptionSelectedTmp, { static: false, read: TemplateRef }) ngtOptionSelectedTemplate: TemplateRef<any>;
  @ContentChild(NgtSelectHeaderTmp, { static: false, read: TemplateRef }) ngtSelectHeaderTemplate: TemplateRef<any>;
  @ViewChild(NgSelectComponent, { static: true }) ngSelectComponent: NgSelectComponent;

  // Visual
  @Input() label: string = '';
  @Input() helpTitle: string;
  @Input() helpText: string;
  @Input() shining = false;
  @Input() loading: boolean = false;
  @Input() loadingText: string = "Carregando resultados...";
  @Input() notFoundText: string;
  @Input() dropdownPosition = 'auto';
  @Input() typeToSearchText: string = 'Digite para procurar...';
  @Input() clearAllTooltip: string = 'Limpar seleção';
  @Input() placeholder: string = 'Selecione...';
  @Input() createText: string = 'Adicionar ';
  @Input() labelForId: string = '';

  // Behavior
  @Input() name: string;
  @Input() allowCreate: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() remoteResource: any;
  @Input() hideSelected: boolean;
  @Input() bindLabel: string = 'name';
  @Input() bindValue: string = undefined;
  @Input() items: Array<any> | Observable<any> = [];
  @Input() closeOnSelect: boolean = true;
  @Input() clearable: boolean = true;
  @Input() groupBy: string | Function = null;
  @Input() groupValue: (groupKey: string, cildren: any[]) => Object;
  @Input() maxSelectedItems: number = undefined;
  @Input() multiple: boolean = false;
  @Input() searchable: boolean = true;
  @Input() clearSearchOnAdd: boolean = true;
  @Input() virtualScroll: boolean = true;
  @Input() trackBy: (item: any) => any;
  @Input() tabIndex: number;
  @Input() typeahead: Subject<any>;
  @Input() compareWith = (a, b) => a === b;

  // Validation
  @Input() isRequired: boolean = false;

  public ngtStyle: NgtStylizableService;
  public ngSelectItems: any = [];
  public nativeValue: any;
  public nativeName = uuid();

  private ngSearchObserver: Observer<any>;
  private originalPerPage = 15;

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

  constructor(
    @Optional() @Self()
    public ngtStylizableDirective: NgtStylizableDirective,
    private injector: Injector,
    @Optional() @Host()
    public formContainer: ControlContainer,
    @Optional() @SkipSelf()
    public ngtFormComponent: NgtFormComponent,
    private ngtHttp: NgtHttpService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super();

    if (this.ngtFormComponent) {
      this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
        this.shining = shining;
      });
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

  ngOnInit() {
    this.initNgSelectItems();
  }

  private initComponent() {
    if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
      this.formControl = this.formContainer.control.get(this.name);
      this.markAsPristine();
      this.updateValidations();
    }
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
      this.typeahead.subscribe((term) => {
        this.search({ term: term });
      });

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

  public search(filters: any) {
    this.currentState.filters = { ...this.currentState.filters, ...filters };

    if (!this.remoteResource) {
      return;
    }

    setTimeout(() => {
      this.loading = true;
      this.ngtHttp
        .get(this.remoteResource, this.currentState.filters, this.currentState.pagination)
        .subscribe(
          (response: NgtHttpResponse) => {
            this.loading = false;
            this.ngSearchObserver.next(response.data);
            this.currentState.pagination = response.meta.pagination;
          },
          (error) => {
            this.loading = false;
            console.error(error);
            this.ngSearchObserver.next([]);
          }
        );
    });
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
    }
  }

  private hasChangesBetweenModels(value, nativeValue) {
    return JSON.stringify(value) !== JSON.stringify(nativeValue);
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
    if (this.isDisabled) {
      return 'select-border-disabled';
    } else if (this.formControl && this.formControl.errors && (this.formControl.dirty || (this.formContainer && this.formContainer['submitted']))) {
      return 'select-border-error';
    } else {
      return 'select-border-normal';
    }
  }

  async ngAfterContentInit() {
    await setTimeout(() => {
      this.initComponent();
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

  ngOnChanges(changes) {
    if (changes.isRequired) {
      this.updateValidations();
    }

    if (changes.remoteResource || changes.items) {
      this.initNgSelectItems();
    }
  }

  public setFocus() {
    setTimeout(() => {
      this.ngSelectComponent.focus();
    });
  }

  public onClearSelect() {
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

}
