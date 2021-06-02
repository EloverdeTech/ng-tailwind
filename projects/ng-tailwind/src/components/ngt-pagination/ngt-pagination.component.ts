import { Component, EventEmitter, Injector, Input, Optional, Output } from '@angular/core';

import { NgtHttpMeta, NgtHttpPagination } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-pagination',
    templateUrl: './ngt-pagination.component.html',
    styleUrls: ['./ngt-pagination.component.css']
})
export class NgtPaginationComponent {
    @Input() public pagesInterval: number;

    @Output() public onPageChange: EventEmitter<number> = new EventEmitter();
    @Output() public onPerPageChange: EventEmitter<number> = new EventEmitter();

    /** Styles */
    public ngtPaginationActivePageButtonStyle: NgtStylizableService;
    public ngtPaginationNextPreviousButtonStyle: NgtStylizableService;
    public ngtPaginationNextPreviousSectionButtonStyle: NgtStylizableService;
    public ngtPaginationFirstLastButtonStyle: NgtStylizableService;
    public ngtPaginationPageButtonStyle: NgtStylizableService;

    public sectionStartPage: number;
    public sectionEndPage: number;
    public displayNextSectionButton: boolean;
    public displayPreviousSectionButton: boolean;
    public displayPagination: boolean = true;

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

    public registersPerPageOptions = [
        5, 10, 15, 30, 50, 100
    ];

    public currentRegistersPerPage: number = 15;

    public constructor(
        private injector: Injector,
        @Optional()
        public ngtTranslateService: NgtTranslateService
    ) {
        this.ngtPaginationNextPreviousButtonStyle = new NgtStylizableService();
        this.ngtPaginationNextPreviousSectionButtonStyle = new NgtStylizableService();
        this.ngtPaginationFirstLastButtonStyle = new NgtStylizableService();
        this.ngtPaginationActivePageButtonStyle = new NgtStylizableService();
        this.ngtPaginationPageButtonStyle = new NgtStylizableService();

        this.ngtPaginationNextPreviousButtonStyle.load(this.injector, 'NgtPaginationNextPreviousButton', {
            h: 'h-8',
            w: 'w-8',
            color: {
                text: 'text-white',
                bg: 'bg-gray-700'
            }
        });

        this.ngtPaginationNextPreviousSectionButtonStyle.load(this.injector, 'NgtPaginationNextPreviousButton', {
            h: 'h-8',
            w: 'w-8',
            color: {
                text: 'text-white',
                bg: 'bg-gray-300'
            }
        });

        this.ngtPaginationFirstLastButtonStyle.load(this.injector, 'NgtPaginationFirstLastButton', {
            h: 'h-8',
            w: 'w-8',
            color: {
                text: 'text-white',
                bg: 'bg-gray-900'
            }
        });

        this.ngtPaginationActivePageButtonStyle.load(this.injector, 'NgtPaginationActivePageButton', {
            h: 'h-8',
            w: 'w-8',
            color: {
                text: 'text-white',
                bg: 'bg-gray-500'
            }
        });

        this.ngtPaginationPageButtonStyle.load(this.injector, 'NgtPaginationPageButton', {
            h: 'h-8',
            w: 'w-8',
            color: {
                text: 'text-white',
                bg: 'bg-gray-300'
            }
        });
    }

    public onRegistersPerPageChange(value: any) {
        if (value && this.pagination.per_page != value) {
            this.pagination.per_page = value;

            this.onPerPageChange.emit(value);
        }
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

    public async goToPreviousSection() {
        return this.goToPage(this.sectionStartPage - 1);
    }

    public async goToNextSection() {
        return this.goToPage(this.sectionEndPage + 1);
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

        this.sectionStartPage = Math.floor((this.pagination.page - 1) / this.pagesInterval) * this.pagesInterval + 1;
        this.sectionEndPage = this.sectionStartPage + (this.pagesInterval - 1);

        const totalPages = this.pagination.pages;

        for (let i = this.sectionStartPage; i <= this.sectionEndPage && i <= totalPages; i++) {
            this.pages.push(i);
        }

        this.bindDisplayedButtonSections(this.sectionStartPage, this.sectionEndPage, totalPages);
        this.displayPagination = true;
    }

    public resetPagination() {
        this.pagination = {
            count: null,
            page: 1,
            pages: null,
            total: null,
            from: null,
            to: null,
            per_page: null
        };
    }

    private bindDisplayedButtonSections(sectionStartPage: number, sectionEndPage: number, totalPages: number) {
        this.displayPreviousSectionButton = sectionStartPage > 1 ? true : false;
        this.displayNextSectionButton = sectionEndPage < totalPages ? true : false;
    }
}
