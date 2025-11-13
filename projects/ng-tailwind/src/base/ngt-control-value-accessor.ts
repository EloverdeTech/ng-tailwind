import { EventEmitter, forwardRef, Injector, signal, WritableSignal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

export abstract class NgtControlValueAccessor implements ControlValueAccessor {
    public onValueChangeEvent: EventEmitter<any> = new EventEmitter;

    public formControl: AbstractControl;

    protected injector: Injector;

    private ignore = '{{{{INITIAL_VALUE_IGNORE}}}}';
    private _value: WritableSignal<any> = signal(this.ignore);

    public constructor() {
        this.registerOnTouched(this.onTouched);
    }

    public get value(): any {
        return this._value() != this.ignore ? this._value() : null;
    };

    public set value(v: any) {
        if (!this.hasValueChanges(v, this._value())) {
            this._value.set(v);

            this.onChange(v);

            if (!this.formControl) {
                this.formControl = this.getControl();
            }

            this.formControl?.markAsDirty();

            this.change(v);
        }
    }

    public writeValue(value: any): void {
        if (value == this.ignore || this.hasValueChanges(value, this._value())) {
            return;
        }

        this._value.set(value);

        this.onChange(value);
        this.change(value);
    }

    public markAsPristine(): void {
        this.formControl?.markAsPristine();
    }

    public markAsDirty(): void {
        this.formControl?.markAsDirty();
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public change(value: any) { };

    public onValueChange(): EventEmitter<any> {
        return this.onValueChangeEvent;
    }

    public onChange = (_) => { };

    public onTouched = () => {
        if (!this.formControl) {
            this.formControl = this.getControl();
        }

        this.formControl?.markAsTouched();
    };

    public isValid(): boolean {
        if (!this.formControl) {
            this.formControl = this.getControl();
        }

        if (this.formControl) {
            this.formControl.markAsDirty();

            return this.formControl.valid;
        }

        return true;
    }

    protected getControl(): AbstractControl {
        try {
            const ngControl = this.injector.get(NgControl, null);

            return ngControl.control;
        } catch {
            return null;
        }
    }

    private hasValueChanges(value1: any, value2: any): boolean {
        if (Array.isArray(value1)) {
            value1 = JSON.stringify(value1);
        }

        if (Array.isArray(value2)) {
            value2 = JSON.stringify(value2);
        }

        return value1 === value2;
    }
}

export function NgtValueAccessorProvider(component: any) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => component),
        multi: true,
    };
}
