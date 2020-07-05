import { Component, ElementRef, Injector, Input, Optional, Self, SkipSelf, ViewChild } from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { uuid } from '../../../helpers/uuid';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtCheckboxComponent } from '../../ngt-checkbox/ngt-checkbox.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-td-check]',
    templateUrl: './ngt-td-check.component.html',
    styleUrls: ['./ngt-td-check.component.css'],
})
export class NgtTdCheckComponent {
    @ViewChild(NgtCheckboxComponent, { static: true }) public checkbox: NgtCheckboxComponent;
    @Input() public reference: any;

    public checked = false;
    public ngtStyle: NgtStylizableService;
    private id = uuid();

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        private ngtDataTable: NgtDatatableComponent
    ) {
        this.bindNgtStyle();
    }

    public ngAfterContentInit() {
        if (this.ngtDataTable) {
            this.ngtDataTable.onToogleAllCheckboxes.subscribe((checked: boolean) => {
                this.checked = checked;
            });

            this.ngtDataTable.onClearSelectedElements.subscribe(() => {
                this.checked = false;
            });
        }
    }

    public onCheckboxChange(checked: boolean) {
        if (this.ngtDataTable) {
            this.ngtDataTable.onToogleCheckbox.emit({
                id: this.id,
                checked: checked,
                reference: this.reference
            });
        }
    }

    private bindNgtStyle() {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtTdCheck', {
            py: 'py-4',
            px: 'px-6',
            text: 'text-center',
            border: 'border-b',
            color: {
                border: ''
            }
        });

        this.hostElement.nativeElement.classList += this.ngtStyle.compile([
            'h',
            'px',
            'py',
            'pb',
            'pl',
            'pr',
            'pt',
            'mb',
            'ml',
            'mr',
            'mt',
            'border',
            'color.border',
        ]);
    }
}
