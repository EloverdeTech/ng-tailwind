import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgtAttachmentHttpService } from '../../../../../services/http/ngt-attachment-http.service';
import { NgtDropzonePreviewType } from '../../../../../meta/ngt-dropzone.meta';

export interface UploadFilesResult {
    uploadedFiles: any[];
    uploadedAttachments: any[];
    unacceptedFiles: File[];
}

@Injectable()
export class NgtDropzoneFileService {
    public constructor(
        private ngtAttachmentHttpService: NgtAttachmentHttpService
    ) { }

    public async uploadFiles(
        files: File[],
        remoteResource: any,
        unacceptedFileType?: string
    ): Promise<UploadFilesResult> {
        const uploadedFiles: any[] = [];
        const uploadedAttachments: any[] = [];
        const observables: Observable<void>[] = [];
        const unacceptedFiles: File[] = [];

        files.forEach(file => {
            if (unacceptedFileType && file.type.includes(unacceptedFileType)) {
                unacceptedFiles.push(file);

                return;
            }

            observables.push(
                this.ngtAttachmentHttpService.upload(file, remoteResource)
                    .pipe(
                        map((response: any) => {
                            if (response?.data) {
                                if (response.data?.attributes?.data) {
                                    file['url'] = response.data.attributes.data.url;
                                }

                                uploadedFiles.push({
                                    id: response.data.id,
                                    size: file.size,
                                    file: file
                                });

                                response.data['loaded'] = true;

                                uploadedAttachments.push(response.data);
                            }
                        })
                    )
            );
        });

        if (observables.length) {
            await lastValueFrom(forkJoin(observables));
        }

        return { uploadedFiles, uploadedAttachments, unacceptedFiles };
    }

    public async loadFilePreview(attachments: any[]): Promise<any[]> {
        const loadedResources: any[] = [];
        const observables: Observable<void>[] = [];

        attachments.forEach((attachment: any) => {
            if (!(attachment instanceof File) && !attachment.loaded) {
                attachment['loaded'] = true;

                observables.push(
                    this.ngtAttachmentHttpService.preview(attachment)
                        .pipe(
                            map((response: any) => {
                                loadedResources.push({
                                    id: response.data.getApiId(),
                                    file: response.data.getAttribute('file')
                                });
                            })
                        )
                );
            }
        });

        if (observables.length) {
            await lastValueFrom(forkJoin(observables));
        }

        return loadedResources;
    }

    public downloadFile(attachment: any): Observable<any> {
        return this.ngtAttachmentHttpService.download(attachment);
    }

    public isImage(resource: any, previewType: NgtDropzonePreviewType): boolean {
        return previewType === NgtDropzonePreviewType.IMAGE
            || (
                resource.file?.type?.includes('image')
                && !resource.file?.type?.includes('dwg')
            );
    }

    public isVideo(resource: any, previewType: NgtDropzonePreviewType): boolean {
        return previewType === NgtDropzonePreviewType.VIDEO
            || resource.file?.type?.includes('video');
    }

    public isAudio(resource: any): boolean {
        return resource.file?.type?.includes('audio');
    }

    public isFile(resource: any, previewType: NgtDropzonePreviewType): boolean {
        return !this.isImage(resource, previewType)
            && !this.isAudio(resource)
            && !this.isVideo(resource, previewType);
    }

    public getFormattedFileSize(resource: any): string {
        if (!resource) {
            return '0 Kb';
        }

        let size = resource.size || resource.fileSize;

        if (!size) {
            size = resource.file?.size || 0;
        }

        const sizeInBytes = parseFloat(size);

        if (sizeInBytes > 1000000) {
            return (sizeInBytes / 1000000).toFixed(2) + ' Mb';
        }

        return Math.round(sizeInBytes / 1000) + ' Kb';
    }

    public resetFilesLoad(files: any[]): void {
        if (Array.isArray(files)) {
            files.forEach(file => {
                if (file) {
                    file['loaded'] = false;
                }
            });
        }
    }
}
