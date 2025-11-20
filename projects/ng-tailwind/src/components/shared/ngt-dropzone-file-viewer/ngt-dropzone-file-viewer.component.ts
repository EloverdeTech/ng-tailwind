import {
 ChangeDetectionStrategy, Component, computed, effect, HostListener, input, output, Signal, signal, ViewChild, WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EloverdeDocViewerComponent, EloverdeDocViewerModule } from 'eloverde-doc-viewer';

import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        EloverdeDocViewerModule,
    ],
})
export class NgtDropzoneFileViewerComponent {
    @ViewChild(EloverdeDocViewerComponent) public eloverdeDocViewer: EloverdeDocViewerComponent;

    /** Visual Inputs */

    public readonly url = input<string>();
    public readonly fileName = input<string>();
    public readonly fileSize = input<number>();
    public readonly disableContent = input<string>('none');
    public readonly canDownloadFile = input<boolean>(true);

    /** Outputs */

    public readonly onClose = output<void>();

    /** Internal Signals */

    public readonly canShowViewer: WritableSignal<boolean> = signal(false);
    public readonly loading: WritableSignal<boolean> = signal(false);
    public readonly maxFileSize: WritableSignal<number> = signal(30000000); /** 30 MB */

    /** Computed Signals */

    public readonly isFileTooLarge: Signal<boolean> = computed(
        () => (this.fileSize() || 0) > this.maxFileSize()
    );

    public constructor(
        public ngtTranslateService: NgtTranslateService
    ) {
        this.registerEffects();
    }

    @HostListener('window:keydown', ['$event'])
    public keyEvent(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            this.canShowViewer.set(false);

            setTimeout(() => this.onClose.emit(), 500);
        }
    }

    public init(): void {
        if ((this.fileSize() || 0) < this.maxFileSize()) {
            this.loading.set(true);
            this.canShowViewer.set(true);
        }
    }

    public close(): void {
        this.canShowViewer.set(false);

        this.onClose.emit();
    }

    public handleClose(): void {
        this.onClose.emit();
    }

    public downloadFile(): void {
        const file = document.createElement('a');

        file.target = '_blank';
        file.href = this.url() || '';
        file.setAttribute('download', this.fileName() || '');
        file.click();
    }

    private registerEffects(): void {
        effect(() => {
            const size = this.fileSize();
            const maxSize = this.maxFileSize();

            if (size && size >= maxSize) {
                this.canShowViewer.set(false);
                this.loading.set(false);
            }
        });
    }
}
