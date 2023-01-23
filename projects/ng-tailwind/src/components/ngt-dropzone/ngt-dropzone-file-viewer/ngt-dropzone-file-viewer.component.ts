import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { EloverdeDocViewerComponent } from 'eloverde-doc-viewer';

import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @ViewChild(EloverdeDocViewerComponent) public eloverdeDocViewer: EloverdeDocViewerComponent;

    @Input() public url: string;
    @Input() public fileName: string;
    @Input() public fileSize: number;
    @Input() public disableContent: string = 'none';
    @Input() public canDownloadFile: boolean = true;

    @Output() public onClose: EventEmitter<void> = new EventEmitter();

    public canShowViewer: boolean;
    public loading: boolean;
    public maxFileSize: number = 10000000; /** 10 MB */

    public constructor(
        public ngtTranslateService: NgtTranslateService
    ) { }

    @HostListener('window:keydown', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            this.canShowViewer = false;

            setTimeout(() => this.onClose.emit(), 500);
        }
    }

    public init(): void {
        if (this.fileSize < this.maxFileSize) {
            this.loading = true;
            this.canShowViewer = true;
        }
    }

    public close(): void {
        this.canShowViewer = false;
    }

    public handleClose(): void {
        this.onClose.emit();
    }

    public downloadFile(): void {
        let file = document.createElement("a");

        file.target = '_blank';
        file.href = this.url;
        file.setAttribute("download", this.fileName);
        file.click();
    }
}
