import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgtDatatableComponent, NgtDatatableType } from 'projects/ng-tailwind/src/public-api';

@Component({
    selector: 'app-ngt-datatable-page',
    templateUrl: './ngt-datatable-page.component.html',
    styleUrls: ['./ngt-datatable-page.component.css']
})
export class NgtDatatablePageComponent implements OnInit, AfterViewInit {
    @ViewChild('ngtDatatable', { static: false }) private ngtDatatable: NgtDatatableComponent;

    public ngtDatatableType = NgtDatatableType.FIXED;
    public remoteResource = {};
    public items = [];

    public constructor() { }

    public ngOnInit() {
        for (let i = 0; i < 500; i++) {
            this.items.push('Teste ' + i);
        }
    }

    public ngAfterViewInit() {
        this.ngtDatatable.init();
        setTimeout(() => {
            this.ngtDatatable.refresh();
        }, 500);
    }

    public delete() {
        const references: Array<string> = this.ngtDatatable.selectedElements.map(element => element.reference);

        this.items = this.items.filter(element => !references.includes(element));
        this.ngtDatatable.selectedElements = [];
        this.ngtDatatable.onDataChange.emit();
    }
}
