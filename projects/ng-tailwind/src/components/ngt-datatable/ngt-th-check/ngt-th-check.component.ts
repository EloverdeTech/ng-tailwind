import { AfterContentInit, Component, Optional, SkipSelf } from '@angular/core';

import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
  selector: '[ngt-th-check]',
  templateUrl: './ngt-th-check.component.html',
  styleUrls: ['./ngt-th-check.component.css'],
  host: { class: 'py-5 px-6 text-center border-b' }
})
export class NgtThCheckComponent implements AfterContentInit {
  public checked = false;

  constructor(
    @Optional() @SkipSelf()
    private ngtDataTable: NgtDatatableComponent
  ) { }

  ngAfterContentInit() {
    if (this.ngtDataTable) {
      this.ngtDataTable.onDataChange.subscribe(() => {
        this.checked = false;
      });
    }
  }

  onCheckboxChange(checked: boolean) {
    if (this.ngtDataTable) {
      this.ngtDataTable.onToogleAllCheckboxes.emit(checked);
    }
  }
}
