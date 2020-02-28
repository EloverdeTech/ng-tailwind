import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { NgtHttpResponse, NgtHttpService } from '../../services/http/ngt-http.service';
import { NgtInputComponent } from '../ngt-input/ngt-input.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtPaginationComponent } from '../ngt-pagination/ngt-pagination.component';

@Component({
  selector: 'ngt-datatable',
  templateUrl: './ngt-datatable.component.html',
  styleUrls: ['./ngt-datatable.component.css']
})
export class NgtDatatableComponent implements OnInit {
  @ViewChild('searchModal', { static: true }) searchModal: NgtModalComponent;
  @ViewChild('ngtPagination', { static: true }) ngtPagination: NgtPaginationComponent;

  @Input() remoteResource: any;
  @Input() type: NgtDatatableType = NgtDatatableType.remote;

  @Input() filterTagBgColor: string = 'blue-500';
  @Input() inputSearch: NgtInputComponent;
  @Input() defaultFilters: any = {};
  @Input() filtersDescription = {
    reference: name
  };

  @Output() onDataChange = new EventEmitter();
  @Output() onClearFilter = new EventEmitter();
  @Output() onToogleAllCheckboxes = new EventEmitter();
  @Output() onToogleCheckbox: EventEmitter<NgtCheckedElement> = new EventEmitter();

  public searchModalTemplate: TemplateRef<any>;
  public data = [];
  public loading = false;
  public cleaningFilter = false;
  public componentReady = false;
  public filtersTranslated = [];
  public emptyStateVisible: boolean;

  public selectedElements = [];
  private searchTimeout: any;
  private currentState = {
    filters: {},
    sort: {
      field: '',
      direction: ''
    }
  };

  constructor(private ngtHttpService: NgtHttpService) { }

  public setSearchModalTemplate(template: TemplateRef<any>) {
    this.searchModalTemplate = template;
  }

  public openSearchModal() {
    this.searchModal.open();
  }

  ngOnInit() {
    if (this.inputSearch) {
      this.initSearchWithInput();
    }

    this.initCheckboxEvent();
  }

  public getCurrentState() {
    return this.currentState;
  }

  public init() {
    this.componentReady = true;
  }

  public async search(filters?: any) {
    this.currentState.filters = { ...this.currentState.filters, ...filters };
    this.applyFiltersDescription();

    return this.apply(1);
  }

  public async sort(field: any, direction: any) {
    this.currentState.sort = {
      field: field,
      direction: direction
    };

    return this.apply(this.ngtPagination.getCurrentPage());
  }

  public async refresh() {
    return this.apply(this.ngtPagination.getCurrentPage());
  }

  public getData() {
    return this.data;
  }

  public getCurrentSort() {
    return this.currentState.sort;
  }

  public applyFiltersDescription() {
    if (!this.cleaningFilter) {
      this.filtersTranslated = [];
      for (let reference in this.currentState.filters) {
        if (this.filtersDescription[reference] && this.currentState.filters[reference]) {
          this.filtersTranslated.push({
            reference: reference,
            value: this.currentState.filters[reference],
            translation: this.filtersDescription[reference]
          });
        }
      }
    }
  }

  public setFilterDescription(reference: string, description: string) {
    this.filtersDescription[reference] = description;
  }

  public removeFilter(reference?: any) {
    this.cleaningFilter = true;

    if (!reference) {
      this.currentState.filters = {};
      this.filtersTranslated = [];
    } else {
      delete this.currentState.filters[reference];
      this.filtersTranslated = this.filtersTranslated.filter(element => element && element.reference !== reference);
    }

    this.onClearFilter.emit(reference);

    if (this.inputSearch && (reference === 'term' || !reference)) {
      this.inputSearch.value = '';
    }

    this.apply(this.ngtPagination.getCurrentPage()).then(() => {
      this.cleaningFilter = false;
    });
  }

  public hasAppliedFilters() {
    for (let reference in this.currentState.filters) {
      if (this.currentState.filters[reference]) {
        return true;
      }
    }

    return false;
  }

  public ngOnChanges(changes) {
    if (changes.inputSearch) {
      this.initSearchWithInput();
    }
  }

  public async apply(page = 1) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!this.componentReady) {
      return;
    }

    this.data = [];
    this.selectedElements = [];

    if (this.type === NgtDatatableType.remote) {
      if (this.remoteResource) {
        this.loading = true;
        this.bindVisibilityAttributes();

        this.searchTimeout = setTimeout(() => {
          let pagination = { ...this.ngtPagination.getPagination(), ...{ page: page } };

          this.ngtHttpService.get(
            this.remoteResource, this.getQualifiedFilters(), pagination, this.currentState.sort
          ).subscribe(
            (response: NgtHttpResponse) => {
              this.proccessRemoteResponse(response.data);
              this.ngtPagination.proccessPagination(response.meta);
              this.onDataChange.emit(this.data);
              this.loading = false;
              this.bindVisibilityAttributes();
            },
            (error) => {
              console.error(error);
              this.loading = false;
            }
          );
        }, 500);
      } else {
        console.error('The property [remoteResource] needs to be present to be able to make remote search');
      }
    } else if (this.type == NgtDatatableType.fixed) {
      this.bindVisibilityAttributes();
    }
  }

  private getQualifiedFilters() {
    let qualifiedFilter = {};

    if (this.currentState.filters) {
      for (let reference in this.currentState.filters) {
        let filter = this.currentState.filters[reference];

        if (filter instanceof NgtCustomFilter) {
          if (filter.tagLabel) {
            this.filtersDescription[reference] = filter.tagLabel;
            this.applyFiltersDescription();
          }

          qualifiedFilter[reference] = filter.term;
        } else {
          qualifiedFilter[reference] = filter;
        }
      }
    }

    return qualifiedFilter;
  }

  private bindVisibilityAttributes() {
    if (this.type == NgtDatatableType.remote && !this.data.length && !this.loading) {
      this.emptyStateVisible = true;
    } else if (this.type == NgtDatatableType.fixed) {
      this.emptyStateVisible = false;
    } else {
      this.emptyStateVisible = false;
    }
  }

  private proccessRemoteResponse(response: any) {
    this.data = response;
  }

  private initSearchWithInput() {
    this.inputSearch.onValueChange().subscribe((value) => {
      this.search({ term: value });
    });
  }

  private initCheckboxEvent() {
    this.onToogleCheckbox.subscribe((checkedElement: NgtCheckedElement) => {
      this.selectedElements = this.selectedElements.filter(item => item.id !== checkedElement.id);

      if (checkedElement.checked) {
        this.selectedElements.push(checkedElement);
      }
    });
  }
}

export enum NgtDatatableType {
  remote = 'remote',
  fixed = 'fixed'
}

export class NgtCheckedElement {
  id: string;
  checked: boolean;
  reference: any;
}

export class NgtCustomFilter {
  term: string;
  tagValue: string;
  tagLabel?: string;
}