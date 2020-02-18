import { AfterViewInit, Component, ElementRef, Host, Input, Optional, Renderer2, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';

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

  constructor(
    @Optional() @Host()
    public formContainer: ControlContainer,
    private renderer: Renderer2
  ) {
    super();
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
