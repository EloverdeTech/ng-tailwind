import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NgxDocViewerComponent } from 'ngx-doc-viewer';

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @ViewChild(NgxDocViewerComponent) public ngxDocViewer: NgxDocViewerComponent;

    @Input() public url: string = '';
    @Input() public fileName: string = '';
    @Output() public onClose: EventEmitter<any> = new EventEmitter();

    public canShowViewer: boolean = false;

    @HostListener('window:keydown', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        if (event.code == 'Escape') {
            this.canShowViewer = false;
            setTimeout(() => {
                this.onClose.emit();
            }, 500);
        }
    }

    public init() {
        this.canShowViewer = true;

        this.initReloadInterval();
    }

    public close() {
        this.canShowViewer = false;
        this.onClose.emit();
    }

    public downloadFile() {
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
                }
            });
        }, 1000);
    }
}
