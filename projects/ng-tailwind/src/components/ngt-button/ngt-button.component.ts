import { Component, Injector, Input, OnChanges, Optional, Self, SimpleChanges } from '@angular/core';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-button',
  templateUrl: './ngt-button.component.html',
  styleUrls: ['./ngt-button.component.css'],
})
export class NgtButtonComponent implements OnChanges {
  @Input() link: boolean = false;
  @Input() href: string;
  @Input() type: string = 'success';
  @Input() loading: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() noSubmit: boolean = false;

  public ngtStyle: NgtStylizableService;

  constructor(
    // @Optional() @SkipSelf()
    // private ngtFormComponent: NgtFormComponent
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
  ) {
    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    // if (this.ngtFormComponent) {
    //   this.ngtFormComponent.onLoadingChange.subscribe((loading) => {
    //     this.loading = loading;
    //   });
    // }
  }

  getClass() {
    if (this.isDisabled || this.loading) {
      return 'opacity-50 ' + this.getCursorClass();
    } else {
      return this.getCursorClass();
    }
  }

  getCursorClass() {
    if (this.loading) {
      return "cursor-wait";
    } else if (this.isDisabled) {
      return "cursor-not-allowed";
    } else {
      return "cursor-pointer";
    }
  }

  onClick(event: Event) {
    if (this.isDisabled || this.loading) {
      event.stopPropagation();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type) {
      if (changes.type.currentValue == 'success') {
        this.ngtStyle.load(this.injector, 'NgtSuccessButton', {
          color: {
            bg: 'green-500'
          }
        });
      } else if (changes.type.currentValue == 'warning') {
        this.ngtStyle.load(this.injector, 'NgtWarningButton', {
          color: {
            bg: 'orange-500'
          }
        });
      } else if (changes.type.currentValue == 'danger') {
        this.ngtStyle.load(this.injector, 'NgtDangerButton', {
          color: {
            bg: 'red-500'
          }
        });
      } else {
        this.ngtStyle.load(this.injector, 'NgtInfoButton', {
          color: {
            bg: 'blue-500'
          }
        });
      }
    }
  }
}
