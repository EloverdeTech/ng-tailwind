import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    input,
    Optional,
    output,
    signal,
    WritableSignal,
} from '@angular/core';

import { NgtHttpMeta, NgtHttpPagination } from '../../services/http/ngt-http.service';
import { NgtTranslateService } from '../../services/http/ngt-translate.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-pagination',
    templateUrl: './ngt-pagination.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtPaginationComponent {
    /** Inputs */

    public readonly pagesInterval = input<number>(4);

    /** Outputs */

    public readonly onPageChange = output<number>();
    public readonly onPerPageChange = output<number>();

    /** Styles */
    public ngtPaginationActivePageButtonStyle: NgtStylizableService;
    public ngtPaginationNextPreviousButtonStyle: NgtStylizableService;
    public ngtPaginationNextPreviousSectionButtonStyle: NgtStylizableService;
    public ngtPaginationFirstLastButtonStyle: NgtStylizableService;
    public ngtPaginationPageButtonStyle: NgtStylizableService;

    public registersPerPageOptions = [
        5, 10, 15, 30, 50, 100
    ];

    /** Signals */

    private readonly sectionStartPageState: WritableSignal<number> = signal(null);
    private readonly sectionEndPageState: WritableSignal<number> = signal(null);
    private readonly displayNextSectionButtonState: WritableSignal<boolean> = signal(false);
    private readonly displayPreviousSectionButtonState: WritableSignal<boolean> = signal(false);
    private readonly displayPaginationState: WritableSignal<boolean> = signal(true);
    private readonly paginationState: WritableSignal<NgtHttpPagination> = signal({
        count: null,
        page: 1,
        pages: null,
        total: null,
        from: null,
        to: null,
        per_page: null
    });

    private readonly pagesState: WritableSignal<number[]> = signal([]);
    private readonly currentRegistersPerPageState: WritableSignal<number> = signal(15);

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
            h: 'h-6',
            w: 'w-6',
            color: {
                text: 'text-white',
                bg: 'bg-gray-700'
            }
        });

        this.ngtPaginationNextPreviousSectionButtonStyle.load(this.injector, 'NgtPaginationNextPreviousButton', {
            h: 'h-6',
            w: 'w-6',
            color: {
                text: 'text-white',
                bg: 'bg-gray-300'
            }
        });

        this.ngtPaginationFirstLastButtonStyle.load(this.injector, 'NgtPaginationFirstLastButton', {
            h: 'h-6',
            w: 'w-6',
            color: {
                text: 'text-white',
                bg: 'bg-gray-900'
            }
        });

        this.ngtPaginationActivePageButtonStyle.load(this.injector, 'NgtPaginationActivePageButton', {
            h: 'h-6',
            w: 'w-6',
            color: {
                text: 'text-white',
                bg: 'bg-gray-500'
            }
        });

        this.ngtPaginationPageButtonStyle.load(this.injector, 'NgtPaginationPageButton', {
            h: 'h-6',
            w: 'w-6',
            color: {
                text: 'text-white',
                bg: 'bg-gray-300'
            }
        });
    }

    public get sectionStartPage(): number {
        return this.sectionStartPageState();
    }

    public get sectionEndPage(): number {
        return this.sectionEndPageState();
    }

    public get displayNextSectionButton(): boolean {
        return this.displayNextSectionButtonState();
    }

    public get displayPreviousSectionButton(): boolean {
        return this.displayPreviousSectionButtonState();
    }

    public get displayPagination(): boolean {
        return this.displayPaginationState();
    }

    public get pagination(): NgtHttpPagination {
        return this.paginationState();
    }

    public get pages(): number[] {
        return this.pagesState();
    }

    public get currentRegistersPerPage(): number {
        return this.currentRegistersPerPageState();
    }

    public set displayPagination(value: boolean) {
        this.displayPaginationState.set(!!value);
    }

    public set pagination(value: NgtHttpPagination) {
        this.paginationState.set(value);
    }

    public set pages(value: number[]) {
        this.pagesState.set(value ?? []);
    }

    public set currentRegistersPerPage(value: number) {
        this.currentRegistersPerPageState.set(value ?? 15);
    }

    public onRegistersPerPageChange(value: any) {
        const pagination = this.paginationState();

        if (value && pagination.per_page != value) {
            this.paginationState.set({
                ...pagination,
                per_page: value
            });
            this.currentRegistersPerPageState.set(value);

            this.onPerPageChange.emit(value);
        }
    }

    public async goToPage(page: number) {
        this.onPageChange.emit(page);
    }

    public async goToPreviousPage() {
        if ((this.paginationState().page - 1) > 0) {
            return this.goToPage(this.paginationState().page - 1);
        }
    }

    public async goToNextPage() {
        if ((this.paginationState().page + 1) <= this.paginationState().pages) {
            return this.goToPage(this.paginationState().page + 1);
        }
    }

    public async goToPreviousSection() {
        return this.goToPage(this.sectionStartPageState() - 1);
    }

    public async goToNextSection() {
        return this.goToPage(this.sectionEndPageState() + 1);
    }

    public async goToFirstPage() {
        if (this.paginationState().page != 1) {
            return this.goToPage(1);
        }
    }

    public async goToLastPage() {
        if (this.paginationState().page != this.paginationState().pages) {
            return this.goToPage(this.paginationState().pages);
        }
    }

    public getCurrentPage() {
        return this.paginationState().page;
    }

    public getPagination() {
        return this.paginationState();
    }

    public proccessPagination(meta: NgtHttpMeta) {
        const pagination = meta.pagination;
        const interval = this.pagesInterval();
        const sectionStartPage = Math.floor((pagination.page - 1) / interval) * interval + 1;
        const sectionEndPage = sectionStartPage + (interval - 1);
        const totalPages = pagination.pages;

        const pages: number[] = [];

        for (let i = sectionStartPage; i <= sectionEndPage && i <= totalPages; i++) {
            pages.push(i);
        }

        this.paginationState.set(pagination);
        this.pagesState.set(pages);
        this.sectionStartPageState.set(sectionStartPage);
        this.sectionEndPageState.set(sectionEndPage);

        this.bindDisplayedButtonSections(sectionStartPage, sectionEndPage, totalPages);
        this.displayPaginationState.set(true);
    }

    public resetPagination() {
        this.paginationState.set({
            count: null,
            page: 1,
            pages: null,
            total: null,
            from: null,
            to: null,
            per_page: null
        });
    }

    private bindDisplayedButtonSections(sectionStartPage: number, sectionEndPage: number, totalPages: number) {
        this.displayPreviousSectionButtonState.set(sectionStartPage > 1);
        this.displayNextSectionButtonState.set(sectionEndPage < totalPages);
    }
}
