import { Component, Host, Input, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { uuid } from '../../helpers/uuid';

const Brazil = require("flatpickr/dist/l10n/pt.js").default.pt;
var moment = require('moment');

@Component({
  selector: 'ngt-date',
  templateUrl: './ngt-date.component.html',
  styleUrls: ['./ngt-date.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    NgtMakeProvider(NgtDateComponent),
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm }
  ]
})
export class NgtDateComponent extends NgtBaseNgModel implements OnInit {
  @ViewChild("ng2FlatpickrComponent", { static: true }) ng2FlatpickrComponent: Ng2FlatpickrComponent;

  //Visual
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() helpTitle = 'Ajuda';
  @Input() helpText = false;
  @Input() shining = false;
  @Input() dateFormat: string = 'd/m/Y H:i';
  @Input() dateFormatNgModel = 'YYYY-MM-DD HH:mm:00';

  //Comportamento
  @Input() name: string;
  @Input() isDisabled: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() mode: string = 'single';
  @Input() time_24hr: boolean = true;
  @Input() enableTime: boolean = true;
  @Input() minuteIncrement: number = 1;
  @Input() allowInput: boolean = false;

  //Validações
  @Input() isRequired: boolean = false;

  public dateConfig: FlatpickrOptions;
  public nativeValue: any;
  public componentReady = false;
  public nativeName = uuid();
  public inputProperties: {
    htmlType?: string,
    length?: number
  } = {};

  constructor(
    @Optional() @Host()
    public formContainer: ControlContainer,
    //@Optional() @SkipSelf()
    //private tailFormComponent: TailFormComponent
  ) {
    super();

    /*if (this.tailFormComponent) {
      this.tailFormComponent.onShiningChange.subscribe((shining) => {
        this.shining = shining;
      });
    }*/
  }

  private initComponent() {
    if (this.formContainer && this.formContainer.control && (this.formControl = this.formContainer.control.get(this.name))) {
      this.updateValidations();

      if (this.value) {
        this.formControl.markAsDirty();
      } else {
        this.formControl.markAsPristine();
      }
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

    syncValidators.push()

    setTimeout(() => {
      this.formControl.setValidators(syncValidators);
      this.formControl.updateValueAndValidity();
    });
  }

  change(value: any) {
    if (this.componentReady) {
      this.onValueChangeEvent.emit(this.value);
    }

    if (value && value != this.nativeValue) {
      this.ng2FlatpickrComponent.setDateFromInput(moment(value).format('DD/MM/YYYY HH:mm:00'));
    }
  }

  async ngOnInit() {
    this.dateConfig = {
      dateFormat: this.dateFormat,
      mode: this.mode,
      minuteIncrement: this.minuteIncrement,
      time_24hr: this.time_24hr,
      enableTime: this.enableTime,
      allowInput: this.allowInput,
      locale: Brazil,
      onChange: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, instance, true),
      onClose: (selectedDates, dateStr, instance) => this.onNativeChange(selectedDates, instance, false),
    };

    if (!this.formContainer) {
      //console.warn("The element must be inside a <form #form='ngForm'> tag!", this.element.nativeElement);
    } if (!this.name) {
      //console.warn("The element must contain a name attribute!", this.element.nativeElement);
    } else {
      // Render delay
      setTimeout(() => { }, 500);
      this.componentReady = true;

      setTimeout(() => {
        this.initComponent();
      });
    }
  }

  onNativeChange(value: any, instance: any, triggerClose: boolean) {
    if (value === undefined) {
      this.value = '';
      this.nativeValue = '';

      if (triggerClose) {
        instance.close();
      }
    } else {
      if (this.mode == 'range') {
        this.nativeValue = [];
        value.forEach(element => {
          this.nativeValue.push(moment(element).format(this.dateFormatNgModel));
        });
      } else {
        this.nativeValue = moment(value[0]).format(this.dateFormatNgModel);
      }

      if (this.value != this.nativeValue) {
        this.value = this.nativeValue;
      }
    }
  }

  getNativeValue() {
    let nativeValue: any = this.nativeValue;

    if (nativeValue && nativeValue.format) {
      nativeValue = nativeValue.format(this.dateFormatNgModel);
    }

    return nativeValue;
  }

  getFormattedNativeValue() {
    let nativeValue: any = this.nativeValue;

    if (nativeValue && Array.isArray(nativeValue)) {
      let formattedNativeValue: string = '';

      nativeValue.forEach(element => {
        element = moment(element);

        if (element.format && !this.enableTime) {
          formattedNativeValue += element.format('DD/MM/YYYY') + ' ';
        } else if (element.format && this.enableTime) {
          formattedNativeValue += element.format('DD/MM/YYYY HH:mm:00') + ' ';
        }
      });

      return formattedNativeValue;
    } else if (nativeValue) {
      nativeValue = moment(nativeValue);

      if (nativeValue.format && !this.enableTime) {
        return nativeValue.format('DD/MM/YYYY') + ' ';
      } else if (nativeValue.format && this.enableTime) {
        return nativeValue.format('DD/MM/YYYY HH:mm:00') + ' ';
      }
    }
  }
}
