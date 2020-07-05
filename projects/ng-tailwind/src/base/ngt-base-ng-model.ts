import { EventEmitter, forwardRef } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Based on https://stackoverflow.com/a/37786142/8055997
 */
export abstract class NgtBaseNgModel implements ControlValueAccessor {
    public formControl: AbstractControl;
    public formContainer: ControlContainer;

    public onValueChangeEvent = new EventEmitter;

    private ignore = '{{{{INITIAL_VALUE_IGNORE}}}}';
    private _value: any = this.ignore;

    public constructor() {
        this.registerOnTouched(this.onTouched);
    }

    public onValueChange() {
        return this.onValueChangeEvent;
    }

    public get value(): any {
        return this._value != this.ignore ? this._value : null;
    };

    public set value(v: any) {
        if (!this.valuesAreEquals(v, this._value)) {
            this._value = v;
            this.onChange(v);

            if (this.formControl) {
                this.formControl.markAsDirty();
            }

            this.change(v);
        }
    }

    public writeValue(value: any) {
        if (value == this.ignore || this.valuesAreEquals(value, this._value)) {
            return;
        }

        this._value = value;
        this.onChange(value);
        this.change(value);
    }

    public onChange = (_) => { };

    public change(v) { };

    public onTouched = () => {
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
    };

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public isValid(): boolean {
        if (this.formControl) {
            this.formControl.markAsDirty();

            return this.formControl.valid;
        }
    }

    public markAsPristine() {
        if (this.formControl) {
            this.formControl.markAsPristine();
        }
    }

    public markAsDirty() {
        if (this.formControl) {
            this.formControl.markAsDirty();
        }
    }

    public setSubmitted(submitted: boolean) {
        if (this.formContainer) {
            this.formContainer['submitted'] = submitted;
        }
    }

    private valuesAreEquals(value1, value2) {
        if (Array.isArray(value1)) {
            value1 = JSON.stringify(value1);
        }

        if (Array.isArray(value2)) {
            value2 = JSON.stringify(value2);
        }

        return value1 === value2;
    }
}

export function NgtMakeProvider(type: any) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => type),
        multi: true
    };
}
