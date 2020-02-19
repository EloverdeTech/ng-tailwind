import { Component, Input, Optional, SkipSelf, ViewChild } from '@angular/core';

import { uuid } from '../../../helpers/uuid';
import { NgtCheckboxComponent } from '../../ngt-checkbox/ngt-checkbox.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
  selector: '[ngt-td-check]',
  templateUrl: './ngt-td-check.component.html',
  styleUrls: ['./ngt-td-check.component.css'],
  host: { class: 'py-5 px-6 text-center border-b' }
})
export class NgtTdCheckComponent {
  @ViewChild(NgtCheckboxComponent, { static: true }) checkbox: NgtCheckboxComponent;
  @Input() reference: any;

  private id = uuid();
  public checked = false;

  constructor(
    @Optional() @SkipSelf()
    private ngtDataTable: NgtDatatableComponent
  ) { }

  ngAfterContentInit() {
    if (this.ngtDataTable) {
      this.ngtDataTable.onToogleAllCheckboxes.subscribe((checked: boolean) => {
        this.checked = checked;
      });
    }
  }

  onCheckboxChange(checked: boolean) {
    if (this.ngtDataTable) {
      this.ngtDataTable.onToogleCheckbox.emit({
        id: this.id,
        checked: checked,
        reference: this.reference
      });
    }
  }
}
