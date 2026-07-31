import {ChangeDetectionStrategy, Component, computed, input, output, Signal, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgtDropzoneFile, NgtDropzoneFileTypeEnum } from '../../../meta/ngt-dropzone.meta';

@Component({
    selector: 'ngt-dropzone-view',
    templateUrl: './ngt-dropzone-view.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
    ],
})
export class NgtDropzoneViewComponent {
    /** Visual Inputs */

    public readonly resources = input<Array<NgtDropzoneFile>>([]);
    public readonly dropzoneHeight = input<string>();
    public readonly loading = input<boolean>(false);
    public readonly placeholder = input<string>();

    /** Outputs */

    public readonly onImageClick = output<{ div: HTMLDivElement; index: number }>();
    public readonly onFileClick = output<{ previewUrl: string; name: string; fileSize: number }>();

    /** Computed Signals */

    public readonly images: Signal<Array<NgtDropzoneFile>> = computed(
        () => this.resources().filter((resource) => this.isImage(resource))
    );

    public readonly audios: Signal<Array<NgtDropzoneFile>> = computed(
        () => this.resources().filter((resource) => this.isAudio(resource))
    );

    public readonly videos: Signal<Array<NgtDropzoneFile>> = computed(
        () => this.resources().filter((resource) => this.isVideo(resource))
    );

    public readonly files: Signal<Array<NgtDropzoneFile>> = computed(
        () => this.resources().filter((resource) => this.isFile(resource))
    );

    public readonly hasNoResources: Signal<boolean> = computed(
        () => !this.loading() && !this.resources()?.length
    );

    /** Constants */

    public readonly ngtDropzoneViewFileTypeEnum = NgtDropzoneFileTypeEnum;

    public handleImageClick(index: number): void {
        const imagesDiv = document.createElement('div');

        this.images().forEach((image: NgtDropzoneFile) => {
            const imageElement = document.createElement('img');

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

    private isImage(resource: NgtDropzoneFile): boolean {
        return resource.mimeType.includes('image');
    }

    private isAudio(resource: NgtDropzoneFile): boolean {
        return resource.mimeType.includes('audio');
    }

    private isVideo(resource: NgtDropzoneFile): boolean {
        return resource.mimeType.includes('video');
    }

    private isFile(resource: NgtDropzoneFile): boolean {
        return !this.isImage(resource) && !this.isAudio(resource) && !this.isVideo(resource);
    }
}
