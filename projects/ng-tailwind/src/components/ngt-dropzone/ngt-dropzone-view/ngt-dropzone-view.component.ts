import { AfterViewInit, Component, Input, SimpleChanges, SkipSelf, ViewEncapsulation } from "@angular/core";
import { NgtDropzoneComponent, NgtDropzoneFile } from "../ngt-dropzone.component";

export enum NgtDropzoneViewFileTypeEnum {
    DOC = 'DOC',
    PDF = 'PDF',
    XLS = 'XLS',
    OTHER = 'OTHER'
}

@Component({
    selector: 'ngt-dropzone-view',
    templateUrl: './ngt-dropzone-view.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NgtDropzoneViewComponent implements AfterViewInit {
    @Input() public resources: Array<any>;

    public images: Array<NgtDropzoneFile>;
    public audios: Array<NgtDropzoneFile>;
    public videos: Array<NgtDropzoneFile>;
    public files: Array<NgtDropzoneFile>;

    public ngtDropzoneViewFileTypeEnum = NgtDropzoneViewFileTypeEnum;

    public constructor(
        @SkipSelf()
        public ngtDropzoneComponent: NgtDropzoneComponent
    ) { }

    public ngAfterViewInit() { }

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

    public onImageClick() {
        const imagesDiv = document.createElement("div");

        this.images.forEach((image: NgtDropzoneFile) => {
            let imageElement = document.createElement("img");

            imageElement.src = image.previewUrl;

            imagesDiv.appendChild(imageElement);
        });

        this.ngtDropzoneComponent.onImageClick(imagesDiv);
    }

    public getDropzoneIcon(resource: NgtDropzoneFile): NgtDropzoneViewFileTypeEnum {
        if (resource.mimeType.includes('.sheet')) {
            return NgtDropzoneViewFileTypeEnum.XLS;
        }

        if (resource.mimeType.includes('pdf')) {
            return NgtDropzoneViewFileTypeEnum.PDF;
        }

        if (resource.mimeType.includes('.document')) {
            return NgtDropzoneViewFileTypeEnum.DOC;
        }

        return NgtDropzoneViewFileTypeEnum.OTHER;
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
