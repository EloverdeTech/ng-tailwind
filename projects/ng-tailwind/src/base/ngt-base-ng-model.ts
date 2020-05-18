import { forwardRef, Input, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ControlContainer } from '@angular/forms';

/**
 * Based on https://stackoverflow.com/a/37786142/8055997
 */
export abstract class NgtBaseNgModel implements ControlValueAccessor {
    public formControl: AbstractControl;
    public formContainer: ControlContainer;

    public onValueChangeEvent = new EventEmitter;

    private ignore = '{{{{INITIAL_VALUE_IGNORE}}}}'
    _value: any = this.ignore;

    constructor() {
        this.registerOnTouched(this.onTouched);
    }

    onValueChange() {
        return this.onValueChangeEvent;
    }

    get value(): any { return this._value != this.ignore ? this._value : null; };

    set value(v: any) {
        if (!this.valuesAreEquals(v, this._value)) {

            this._value = v;
            this.onChange(v);

            if (this.formControl) {
                this.formControl.markAsDirty();
            }

            this.change(v);
        }
    }

    writeValue(value: any) {
        if (value == this.ignore || this.valuesAreEquals(value, this._value)) {
            return;
        }

        this._value = value;
        this.onChange(value);
        this.change(value);
    }

    onChange = (_) => { };

    change(v) { };

    onTouched = () => {
        if (this.formControl) {
            this.formControl.markAsTouched();
        }
    };

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

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
            value1 = value1.toLocaleString();
        }

        if (Array.isArray(value2)) {
            value2 = value2.toLocaleString();
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