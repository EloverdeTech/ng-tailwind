import { Component, ElementRef, Host, Input, OnInit, Optional, Renderer2, ViewChild } from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';

@Component({
  selector: 'ngt-textarea',
  templateUrl: './ngt-textarea.component.html',
  styleUrls: ['./ngt-textarea.component.css'],
  providers: [
    NgtMakeProvider(NgtTextareaComponent),
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm }
  ]
})
export class NgtTextareaComponent extends NgtBaseNgModel implements OnInit {
  @ViewChild("element", { static: true }) element: ElementRef;

  //Visual
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() rows: string = "3";
  @Input() helpTitle = 'Ajuda';
  @Input() helpText = false;
  @Input() shining = false;

  //Comportamento
  @Input() name: string;
  @Input() isDisabled: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() jit: boolean = false;
  @Input() focus: boolean = false;

  //Validações
  @Input() isRequired: boolean = false;
  @Input() maxlength: number;

  public componentReady = false;

  constructor(
    @Optional() @Host()
    public formContainer: ControlContainer,
    // @Optional() @SkipSelf()
    // private tailFormComponent: TailFormComponent,
    private renderer: Renderer2
  ) {
    super();

    // if (this.tailFormComponent) {
    //   this.tailFormComponent.onShiningChange.subscribe((shining) => {
    //     this.shining = shining;
    //   });
    // }
  }

  private initComponent() {
    if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
      if (this.focus) {
        this.setFocus();
      }

      let watch = "change";

      if (this.jit) {
        watch += " keyup keydown keypress";
      }

      watch.split(' ').forEach((evt) => {
        this.renderer.listen(this.element.nativeElement, evt, () => {
          let nativeValue = this.getNativeValue();

          if (this.value != nativeValue) {
            this.value = nativeValue;
          }
        });
      });

      this.renderer.listen(this.element.nativeElement, "keydown", () => {
        if (this.element.nativeElement && this.element.nativeElement.value && this.element.nativeElement.value.length == this.maxlength) {
          event.preventDefault();
          return false;
        }
      });

      this.updateValidations();

      if (this.value) {
        this.formControl.markAsDirty();
      } else {
        this.formControl.markAsPristine();
        this.value = '';
      }
    } else {
      console.warn("The element must contain a ngModel property", this.element.nativeElement);
    }
  }

  private updateValidations() {
    if (!this.formControl) {
      return;
    }

    let syncValidators = [];

    if (this.isRequired) {
      syncValidators.push(Validators.required);
    }

    if (this.maxlength) {
      syncValidators.push(Validators.maxLength(this.maxlength));
    }

    setTimeout(() => {
      this.formControl.setValidators(syncValidators);
      this.formControl.updateValueAndValidity();
    });
  }

  public setFocus() {
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 200);
  }

  ngOnChanges(changes) {
    if (changes.isRequired) {
      this.updateValidations();
    }
  }

  change(value) {
    let nativeValue = this.getNativeValue();
    let ngModelValue = value;

    if (this.componentReady) {
      this.onValueChangeEvent.emit(this.value);
    }

    if (this.value != nativeValue) {
      this.element.nativeElement.value = ngModelValue;
    }
  }

  async ngOnInit() {
    if (!this.formContainer) {
      console.warn("The element must be inside a <form #form='ngForm'> tag!", this.element.nativeElement);
    } if (!this.name) {
      console.warn("The element must contain a name attribute!", this.element.nativeElement);
    } else {
      //Render delay
      setTimeout(() => { }, 500);
      this.componentReady = true;

      setTimeout(() => {
        this.initComponent();
      });
    }
  }

  private getNativeValue() {
    return this.element.nativeElement.value;
  }
}
