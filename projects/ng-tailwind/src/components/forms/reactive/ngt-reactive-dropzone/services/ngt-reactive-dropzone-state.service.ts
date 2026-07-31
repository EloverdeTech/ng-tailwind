import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable()
export class NgtReactiveDropzoneStateService {
    // Visual State
    public readonly dropzoneHeight: WritableSignal<string> = signal('180px');
    public readonly showFileViewer: WritableSignal<boolean> = signal(false);

    // Data State
    public readonly uploadedResources: WritableSignal<any[]> = signal([]);
    public readonly nativeValue: WritableSignal<any[]> = signal([]);

    // Control State
    public readonly forceDisableClick: WritableSignal<boolean> = signal(false);
    public readonly componentReady: WritableSignal<boolean> = signal(false);
    public readonly loading: WritableSignal<boolean> = signal(false);
    public readonly shining: WritableSignal<boolean> = signal(false);

    public reset(): void {
        this.dropzoneHeight.set('180px');
        this.uploadedResources.set([]);
        this.nativeValue.set([]);
        this.forceDisableClick.set(false);
        this.loading.set(false);
        this.shining.set(false);
        this.showFileViewer.set(false);
    }
}
