import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';

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

  public ngtPaginationActivePageButtonStyle: NgtStylizableService;
  public ngtPaginationNextPreviousButtonStyle: NgtStylizableService;
  public ngtPaginationFirstLastButtonStyle: NgtStylizableService;
  public ngtPaginationPageButtonStyle: NgtStylizableService;

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
    private injector: Injector,
  ) {
    this.ngtPaginationNextPreviousButtonStyle = new NgtStylizableService();
    this.ngtPaginationFirstLastButtonStyle = new NgtStylizableService();
    this.ngtPaginationActivePageButtonStyle = new NgtStylizableService();
    this.ngtPaginationPageButtonStyle = new NgtStylizableService();

    this.ngtPaginationNextPreviousButtonStyle.load(this.injector, 'NgtPaginationNextPreviousButton', {
      h: '8',
      w: '8',
      color: {
        text: 'white',
        bg: 'gray-700'
      }
    });

    this.ngtPaginationFirstLastButtonStyle.load(this.injector, 'NgtPaginationFirstLastButton', {
      h: '8',
      w: '8',
      color: {
        text: 'white',
        bg: 'gray-900'
      }
    });

    this.ngtPaginationActivePageButtonStyle.load(this.injector, 'NgtPaginationActivePageButton', {
      h: '8',
      w: '8',
      color: {
        text: 'white',
        bg: 'gray-500'
      }
    });

    this.ngtPaginationPageButtonStyle.load(this.injector, 'NgtPaginationPageButton', {
      h: '8',
      w: '8',
      color: {
        text: 'white',
        bg: 'gray-300'
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
