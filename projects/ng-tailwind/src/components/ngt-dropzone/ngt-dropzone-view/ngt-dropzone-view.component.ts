import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { NgtDropzoneFile, NgtDropzoneFileTypeEnum } from '../ngt-dropzone.meta';

@Component({
    selector: 'ngt-dropzone-view',
    templateUrl: './ngt-dropzone-view.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtDropzoneViewComponent {
    @Input() public resources: Array<any>;
    @Input() public dropzoneHeight: string;
    @Input() public loading: boolean;
    @Input() public placeholder: string;

    @Output() public onImageClick: EventEmitter<{ div: HTMLDivElement; index: number }> = new EventEmitter();
    @Output() public onFileClick: EventEmitter<{ previewUrl: string; name: string; fileSize: number }> = new EventEmitter();

    public images: Array<NgtDropzoneFile>;
    public audios: Array<NgtDropzoneFile>;
    public videos: Array<NgtDropzoneFile>;
    public files: Array<NgtDropzoneFile>;

    public ngtDropzoneViewFileTypeEnum = NgtDropzoneFileTypeEnum;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.resources) {
            this.loadFiles();
        }
    }

    public loadFiles() {
        this.images = this.resources.filter((resource) => this.isImage(resource));
        this.audios = this.resources.filter((resource) => this.isAudio(resource));
        this.videos = this.resources.filter((resource) => this.isVideo(resource));
        this.files = this.resources.filter((resource) => this.isFile(resource));
    }

    public handleImageClick(index: number): void {
        const imagesDiv = document.createElement("div");

        this.images.forEach((image: NgtDropzoneFile) => {
            let imageElement = document.createElement("img");

            imageElement.src = image.previewUrl;

            imagesDiv.appendChild(imageElement);
        });

        this.onImageClick.emit({ div: imagesDiv, index });
    }

    public handleFileClick(previewUrl: string, name: string, fileSize: number): void {
        this.onFileClick.emit({ previewUrl, name, fileSize });
    }

    public getFileType(resource: NgtDropzoneFile): NgtDropzoneFileTypeEnum {
        if (resource.mimeType.includes('.sheet')) {
            return NgtDropzoneFileTypeEnum.XLS;
        }

        if (resource.mimeType.includes('pdf')) {
            return NgtDropzoneFileTypeEnum.PDF;
        }

        if (resource.mimeType.includes('.document')) {
            return NgtDropzoneFileTypeEnum.DOC;
        }

        return NgtDropzoneFileTypeEnum.OTHER;
    }

    public getFormattedFileSize(resource: any): string {
        if (resource) {
            let size = resource.size || resource.fileSize;

            if (!size) {
                if (resource.file && resource.file.size) {
                    size = resource.file.size;
                } else {
                    size = 0;
                }
            }

            if (parseFloat(size) > 1000000) {
                return (parseFloat(size) / 1000000).toFixed(2) + ' Mb';
            }

            return Math.round(parseFloat(size) / 1000) + ' Kb';
        }
    }

    private isImage(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('image');
    }

    private isAudio(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('audio');
    }

    private isVideo(resource: NgtDropzoneFile) {
        return resource.mimeType.includes('video');
    }

    private isFile(resource: NgtDropzoneFile) {
        return !this.isImage(resource) && !this.isAudio(resource) && !this.isVideo(resource);
    }
}
