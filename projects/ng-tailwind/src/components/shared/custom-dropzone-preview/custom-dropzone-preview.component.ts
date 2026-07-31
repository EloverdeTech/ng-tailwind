import { ChangeDetectionStrategy, Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDropzoneModule, NgxDropzonePreviewComponent } from 'ngx-dropzone';

import { NgtDropzoneFileTypeEnum } from '../../../meta/ngt-dropzone.meta';

@Component({
    selector: 'custom-dropzone-preview',
    templateUrl: './custom-dropzone-preview.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        NgxDropzoneModule,
    ],
    providers: [
        {
            provide: NgxDropzonePreviewComponent,
            useExisting: CustomDropzonePreviewComponent
        }
    ],
})
export class CustomDropzonePreviewComponent extends NgxDropzonePreviewComponent implements OnInit {
    /** Computed Signals */

    public readonly fileType: Signal<NgtDropzoneFileTypeEnum> = computed(() => {
        const file = this.fileSignal();

        if (!file) {
            return NgtDropzoneFileTypeEnum.OTHER;
        }

        if (file.type.includes('.sheet')) {
            return NgtDropzoneFileTypeEnum.XLS;
        }

        if (file.type.includes('pdf')) {
            return NgtDropzoneFileTypeEnum.PDF;
        }

        if (file.type.includes('.document')) {
            return NgtDropzoneFileTypeEnum.DOC;
        }

        if (file.type.includes('.dwg')) {
            return NgtDropzoneFileTypeEnum.DWG;
        }

        return NgtDropzoneFileTypeEnum.OTHER;
    });

    /** Internal Signals */

    private readonly fileSignal: WritableSignal<File | null> = signal(null);

    public constructor(public sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    public ngOnInit(): void {
        if (!this.file) {
            console.error('No file to read. Please provide a file using the [file] Input property.');

            return;
        }

        this.fileSignal.set(this.file);
    }
}
