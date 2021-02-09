import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";

@Component({
    selector: 'ngt-dropzone-file-viewer',
    styleUrls: ['./ngt-dropzone-file-viewer.component.css'],
    templateUrl: './ngt-dropzone-file-viewer.component.html'
})
export class NgtDropzoneFileViewerComponent {
    @Input() public url: string = '';
    @Input() public fileName: string = '';
    @Output() public onClose: EventEmitter<any> = new EventEmitter();

    public canShowViewer: boolean = false;

    public constructor() { }

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
    }

    public close() {
        this.canShowViewer = false;
        this.onClose.emit();
    }
}
