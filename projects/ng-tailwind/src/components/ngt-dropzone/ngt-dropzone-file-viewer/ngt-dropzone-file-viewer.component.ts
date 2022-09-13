import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NgxDocViewerComponent } from 'ngx-doc-viewer';

import { NgtTranslateService } from '../../../services/http/ngt-translate.service';

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @ViewChild(NgxDocViewerComponent) public ngxDocViewer: NgxDocViewerComponent;

    @Input() public url: string;
    @Input() public fileName: string;
    @Input() public fileSize: number;

    @Output() public onClose: EventEmitter<void> = new EventEmitter();

    public canShowViewer: boolean;
    public loading: boolean;

    public constructor(
        public ngtTranslateService: NgtTranslateService
    ) { }

    @HostListener('window:keydown', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            this.canShowViewer = false;
            setTimeout(() => {
                this.onClose.emit();
            }, 500);
        }
    }

    public init(): void {
        if (this.fileSize < 5000000) {
            this.loading = true;
            this.canShowViewer = true;

            this.initReloadInterval();
        }
    }

    public close(): void {
        this.canShowViewer = false;
        this.onClose.emit();
    }

    public downloadFile(): void {
        let file = document.createElement("a");

        file.target = '_blank';
        file.href = this.url;
        file.setAttribute("download", this.fileName);
        file.click();
    }

    private initReloadInterval(): void {
        const reloadInterval = setInterval(() => {
            this.ngxDocViewer?.iframes.forEach(iframe => {
                if (iframe.nativeElement.contentDocument) {
                    this.ngxDocViewer.reloadIFrame(iframe.nativeElement);
                } else {
                    clearInterval(reloadInterval);
                    this.loading = false;
                }
            });
        }, 3000);
    }
}
