import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  Injector,
  Input,
  Optional,
  Renderer2,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
  selector: 'ngt-checkbox',
  templateUrl: './ngt-checkbox.component.html',
  styleUrls: ['./ngt-checkbox.component.css'],
  providers: [
    NgtMakeProvider(NgtCheckboxComponent),
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm }
  ]
})
export class NgtCheckboxComponent extends NgtBaseNgModel implements AfterViewInit {
  @ViewChild('element', { static: true }) element: ElementRef;
  @Input() label: string;
  @Input() name: string;

  public ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Optional() @Host()
    public formContainer: ControlContainer,
    private renderer: Renderer2,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
  ) {
    super();

    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'NgtCheckbox', {
      color: {
        bg: 'gray-500'
      }
    });
  }

  change(value) {
    if (this.hasChangesBetweenModels()) {
      this.element.nativeElement.checked = value;
    }
  }

  onNativeChange(value) {
    if (this.hasChangesBetweenModels()) {
      this.value = value;
    }
  }

  hasChangesBetweenModels() {
    return this.element.nativeElement.checked !== this.value;
  }

  ngAfterViewInit() {
    this.renderer.listen(this.element.nativeElement, 'change', (value) => {
      this.onNativeChange(this.element.nativeElement.checked);
    });
  }
}
