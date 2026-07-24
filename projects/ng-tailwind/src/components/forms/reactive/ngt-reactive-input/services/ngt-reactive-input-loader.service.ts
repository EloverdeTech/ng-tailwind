import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({ providedIn: null })
export class NgtReactiveInputLoaderService {
    public shining: WritableSignal<boolean> = signal(false);
    public loading: WritableSignal<boolean> = signal(false);
}
