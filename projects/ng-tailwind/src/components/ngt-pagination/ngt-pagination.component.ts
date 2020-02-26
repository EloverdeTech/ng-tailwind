import { Component, EventEmitter, Input, Output, Injector } from '@angular/core';

import { NgtHttpMeta, NgtHttpPagination } from '../../services/http/ngt-http.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-pagination',
  templateUrl: './ngt-pagination.component.html',
  styleUrls: ['./ngt-pagination.component.css']
})
export class NgtPaginationComponent {

  @Input() pagesInterval: number;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  public ngtPaginationButtonStyle: NgtStylizableService;
  public ngtPaginationActiveButtonStyle: NgtStylizableService;

  public pagination: NgtHttpPagination = {
    count: null,
    page: 1,
    pages: null,
    total: null,
    from: null,
    to: null,
    per_page: null
  };

  public pages = [];

  constructor(
    private injector: Injector
  ) {
    this.ngtPaginationButtonStyle = new NgtStylizableService();
    this.ngtPaginationActiveButtonStyle = new NgtStylizableService();

    this.ngtPaginationButtonStyle.load(this.injector, 'NgtPaginationButton', {
      h: '8',
      w: '8',
      color: {
        text: 'text-black hover:text-white',
        bg: 'bg-none hover:bg-blue-500'
      }
    });

    this.ngtPaginationActiveButtonStyle.load(this.injector, 'NgtPaginationActiveButton', {
      h: '8',
      w: '8',
      color: {
        text: 'white',
        bg: 'blue-500'
      }
    });
  }

  public async goToPage(page: number) {
    this.onPageChange.emit(page);
  }

  public async goToPreviousPage() {
    if ((this.pagination.page - 1) > 0) {
      return this.goToPage(this.pagination.page - 1);
    }
  }

  public async goToNextPage() {
    if ((this.pagination.page + 1) <= this.pagination.pages) {
      return this.goToPage(this.pagination.page + 1);
    }
  }

  public async goToFirstPage() {
    if (this.pagination.page != 1) {
      return this.goToPage(1);
    }
  }

  public async goToLastPage() {
    if (this.pagination.page != this.pagination.pages) {
      return this.goToPage(this.pagination.pages);
    }
  }

  public getCurrentPage() {
    return this.pagination.page;
  }

  public getPagination() {
    return this.pagination;
  }

  public proccessPagination(meta: NgtHttpMeta) {
    this.pages = [];
    this.pagination = meta.pagination;

    let min = Math.floor((this.pagination.page - 1) / this.pagesInterval) * this.pagesInterval + 1;

    for (let i = min; i <= min + (this.pagesInterval - 1) && i <= this.pagination.pages; i++) {
      this.pages.push(i);
    }
  }
}
