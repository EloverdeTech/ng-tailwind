import { Injectable, signal, WritableSignal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: null })
export class NgtSelectStateService {
    public readonly ngSelectItems: WritableSignal<Observable<any> | null> = signal(null);
    public readonly typeaheadSubject: WritableSignal<Subject<string>> = signal(new Subject());
    public readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    public readonly formControlIsDirty: WritableSignal<boolean> = signal(false);
    public readonly formSubmitted: WritableSignal<boolean> = signal(false);
    public readonly wasClicked: WritableSignal<boolean> = signal(false);
    public readonly hadFirstItemsLoad: WritableSignal<boolean> = signal(false);
    public readonly loading: WritableSignal<boolean> = signal(false);

    public reset(): void {
        this.formControlHasErrors.set(false);
        this.formControlIsDirty.set(false);
        this.formSubmitted.set(false);
        this.wasClicked.set(false);
        this.loading.set(false);
    }

    public updateFormControlState(control: AbstractControl, submitted = false): void {
        if (!control) {
            return;
        }

        this.formControlHasErrors.set(!!control.errors && Object.keys(control.errors).length > 0);
        this.formControlIsDirty.set(control.dirty);
        this.formSubmitted.set(submitted);
    }

    public setNgSelectItems(items: Observable<any>): void {
        this.ngSelectItems.set(items);
    }

    public setTypeaheadSubject(subject: Subject<string>): void {
        this.typeaheadSubject.set(subject);
    }

    public markAsClicked(): void {
        this.wasClicked.set(true);
    }

    public markFirstItemsLoaded(): void {
        this.hadFirstItemsLoad.set(true);
    }
}
