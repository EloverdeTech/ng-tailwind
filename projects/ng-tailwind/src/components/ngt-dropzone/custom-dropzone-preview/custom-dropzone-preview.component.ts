import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';

import { NgtDropzoneFileTypeEnum } from '../ngt-dropzone.component';

@Component({
    selector: 'custom-dropzone-preview',
    templateUrl: './custom-dropzone-preview.component.html',
    providers: [
        {
            provide: NgxDropzonePreviewComponent,
            useExisting: CustomDropzonePreviewComponent
        }
    ]
})
export class CustomDropzonePreviewComponent extends NgxDropzonePreviewComponent implements OnInit {
    public fileType: NgtDropzoneFileTypeEnum;

    public constructor(public sanitizer: DomSanitizer) {
        super(sanitizer);
    }

    public ngOnInit(): void {
        if (!this.file) {
            console.error('No file to read. Please provide a file using the [file] Input property.');

            return;
        }

        this.bindFileType();
    }

    private bindFileType(): void {
        if (this.file.type.includes('.sheet')) {
            this.fileType = NgtDropzoneFileTypeEnum.XLS;
        } else if (this.file.type.includes('pdf')) {
            this.fileType = NgtDropzoneFileTypeEnum.PDF;
        } else if (this.file.type.includes('.document')) {
            this.fileType = NgtDropzoneFileTypeEnum.DOC;
        } else if (this.file.type.includes('.dwg')) {
            this.fileType = NgtDropzoneFileTypeEnum.DWG;
        } else {
            this.fileType = NgtDropzoneFileTypeEnum.OTHER;
        }
    }
}
