import {
  Component,
  ElementRef,
  Host,
  Injector,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
  SkipSelf,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

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

  // Visual
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() rows: string = "3";
  @Input() helpTitle: string = 'Ajuda';
  @Input() showCharactersLength: boolean = false;
  @Input() helpText: boolean = false;
  @Input() shining: boolean = false;

  // Behavior
  @Input() name: string;
  @Input() isDisabled: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() jit: boolean = false;
  @Input() focus: boolean = false;

  // Validation
  @Input() isRequired: boolean = false;
  @Input() maxLength: number = 300;

  public componentReady = false;
  public ngtStyle: NgtStylizableService;

  constructor(
    private injector: Injector,
    @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    @Optional() @Host()
    public formContainer: ControlContainer,
    @Optional() @SkipSelf()
    private ngtFormComponent: NgtFormComponent,
    private renderer: Renderer2
  ) {
    super();

    if (this.ngtFormComponent) {
      this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
        this.shining = shining;
      });
    }

    if (this.ngtStylizableDirective) {
      this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
    } else {
      this.ngtStyle = new NgtStylizableService();
    }

    this.ngtStyle.load(this.injector, 'NgtTextarea', {
      color: {
        border: 'border-gray-400 focus:border-gray-700',
        bg: 'bg-bg-white focus:bg-white',
        text: 'text-gray-800'
      }
    });
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

      this.renderer.listen(this.element.nativeElement, "keydown", (event) => {
        if (this.element.nativeElement && this.element.nativeElement.value && this.element.nativeElement.value.length >= this.maxLength) {
          // Backspace and delete
          if (event.keyCode != 8 && event.keyCode != 46) {
            event.preventDefault();
            return false;
          }
        }
      });

      this.updateValidations();

      if (this.value) {
        this.formControl.markAsDirty();
      } else {
        this.formControl.markAsPristine();
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

    if (this.maxLength) {
      syncValidators.push(Validators.maxLength(this.maxLength));
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

  public clear() {
    this.element.nativeElement.value = '';
    this.value = '';
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

  public getRemainingCharacters() {
    if (this.element.nativeElement && this.element.nativeElement.value && this.element.nativeElement.value.length) {
      if ((this.maxLength - this.element.nativeElement.value.length) > 0) {
        return this.maxLength - this.element.nativeElement.value.length;
      } else {
        return 0;
      }
    }

    return this.maxLength;
  }

  private getNativeValue() {
    return this.element.nativeElement.value;
  }
}
