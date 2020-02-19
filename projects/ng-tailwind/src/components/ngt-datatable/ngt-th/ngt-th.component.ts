import { Component, EventEmitter, Input, Optional, Output, SkipSelf, TemplateRef, ViewChild } from '@angular/core';

import { NgtInputComponent } from '../../ngt-input/ngt-input.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
  selector: '[ngt-th]',
  templateUrl: './ngt-th.component.html',
  styleUrls: ['./ngt-th.component.css'],
  host: { class: 'py-4 px-6 font-bold uppercase text-sm border-b' },
})
export class NgtThComponent {
  @ViewChild('searchInput', { static: false }) searchInput: NgtInputComponent;
  @ViewChild('modal', { static: true }) modal: TemplateRef<any>;

  @Input() reference: string;
  @Input() sortable: boolean;
  @Input() searchable: boolean;
  @Input() hasCustomSearch: boolean = false;
  @Input() searchLabel: string;

  @Output() onEnableSearch = new EventEmitter();

  public inputFocused: boolean = false;
  public isCurrentSort = false;
  public sortDirection = '';
  public searchTerm: any;
  public customSearchTerm: any;

  constructor(
    @Optional() @SkipSelf()
    public ngtDataTable: NgtDatatableComponent
  ) {
    if (this.checkDataTable()) {
      this.ngtDataTable.onDataChange.subscribe(() => {
        this.isCurrentSort = this.ngtDataTable.getCurrentSort().field == this.reference;
        if (this.isCurrentSort) {
          this.sortDirection = this.ngtDataTable.getCurrentSort().direction;
        }
      });

      this.ngtDataTable.onClearFilter.subscribe((reference) => {
        if (reference == this.reference || !reference) {
          this.searchTerm = '';
          this.customSearchTerm = '';
        }
      });
    }
  }

  async sort() {
    if (this.sortable && this.checkDataTable() && this.checkReference()) {
      let sortDirection = this.getNextSortDirection();
      if (sortDirection) {
        await this.ngtDataTable.sort(this.reference, sortDirection);
      } else {
        this.ngtDataTable.sort('', '');
      }

      this.sortDirection = sortDirection;
    }
  }

  private getNextSortDirection() {
    switch (this.sortDirection) {
      case 'asc': return 'desc';
      case 'desc': return '';
      case '': return 'asc';
    }
  }

  enableSearch() {
    this.ngtDataTable.setSearchModalTemplate(this.modal);
    this.ngtDataTable.openSearchModal();

    if (!this.hasCustomSearch) {
      setTimeout(() => {
        this.searchInput.setFocus();
      });
    }

    this.onEnableSearch.emit();
  }

  search(term: any) {
    if (this.searchable && this.reference) {
      let filter = {};
      filter[this.reference] = term;
      this.ngtDataTable.search(filter);
    }
  }

  private checkDataTable() {
    if (!this.ngtDataTable) {
      console.error('The [ngt-th] must be inside of a [ngt-datatable]');
      return false;
    }

    return true;
  }

  private checkReference() {
    if (!this.reference) {
      console.error('The [ngt-th] must have a [reference] property to be able to sort');
      return false;
    }

    return true;
  }

  public customSearch(term: any) {
    this.customSearchTerm = term;
  }
}
