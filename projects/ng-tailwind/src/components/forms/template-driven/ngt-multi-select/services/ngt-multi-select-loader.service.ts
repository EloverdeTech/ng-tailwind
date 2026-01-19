import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable()
export class NgtMultiSelectLoaderService {
    private readonly _shining: WritableSignal<boolean> = signal(false);
    private readonly _loading: WritableSignal<boolean> = signal(false);

    public get shining() {
        return this._shining.asReadonly();
    }

    public get loading() {
        return this._loading.asReadonly();
    }

    public setShining(value: boolean): void {
        this._shining.set(value);
    }

    public setLoading(value: boolean): void {
        this._loading.set(value);
    }
}
