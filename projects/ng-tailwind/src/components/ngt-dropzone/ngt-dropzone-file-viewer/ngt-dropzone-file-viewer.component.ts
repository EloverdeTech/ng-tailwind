import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { NgxDocViewerComponent } from "ngx-doc-viewer";

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @ViewChild(NgxDocViewerComponent, { static: true }) public ngxDocViewer: NgxDocViewerComponent;

    @Input() public url: string = '';
    @Input() public fileName: string = '';
    @Output() public onClose: EventEmitter<any> = new EventEmitter();

    public loading: boolean = true;

    public constructor() { }

    public init() {
        if (this.ngxDocViewer.iframes.first) {
            this.loading = true;
            this.ngxDocViewer.reloadIFrame(this.ngxDocViewer.iframes.first.nativeElement);
        }
    }

    public close() {
        this.onClose.emit();
    }

    public afterLoad() {
        this.loading = false;
    }
}
