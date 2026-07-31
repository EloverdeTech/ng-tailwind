import { Injectable, signal, WritableSignal } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { Observable , Subject } from "rxjs";

@Injectable({ providedIn: null })
export class NgtReactiveSelectStateService {
    public readonly ngSelectItems: WritableSignal<Observable<any>> = signal(null);
    public readonly typeaheadSubject: WritableSignal<Subject<string>> = signal(new Subject());
    public readonly formControlHasErrors: WritableSignal<boolean> = signal(false);
    public readonly formControlIsDirty: WritableSignal<boolean> = signal(false);
    public readonly wasClicked: WritableSignal<boolean> = signal(false);
    public readonly hadFirstItemsLoad: WritableSignal<boolean> = signal(false);
    public readonly loading: WritableSignal<boolean> = signal(false);
    public readonly shining: WritableSignal<boolean> = signal(false);

    public reset(): void {
        this.formControlHasErrors.set(false);
        this.formControlIsDirty.set(false);
        this.wasClicked.set(false);
        this.loading.set(false);
        this.shining.set(false);
    }

    public updateFormControlState(control: AbstractControl): void {
        if (!control) {
            return;
        }

        this.formControlHasErrors.set(!!control.errors && Object.keys(control.errors).length > 0);
        this.formControlIsDirty.set(control.dirty);
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
