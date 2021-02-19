import {
    Component,
    EventEmitter,
    Host,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
    SkipSelf,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { NgxDropzoneChangeEvent, NgxDropzoneComponent } from 'ngx-dropzone';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import Viewer from 'viewerjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtAttachmentHttpService } from '../../services/http/ngt-attachment-http.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtDropzoneFileViewerComponent } from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
export interface NgtDropzoneFile {
    downloadUrl: string;
    previewUrl: string;
    thumbnailUrl: string;
    name: string;
    mimeType: string;
    fileSize: any;
};
@Component({
    selector: 'ngt-dropzone',
    templateUrl: './ngt-dropzone.component.html',
    styleUrls: ['./ngt-dropzone.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        NgtMakeProvider(NgtDropzoneComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtDropzoneComponent extends NgtBaseNgModel implements OnInit, OnDestroy {
    @ViewChild('ngxDropzone', { static: true }) public ngxDropzone: NgxDropzoneComponent;
    @ViewChild(NgtDropzoneFileViewerComponent, { static: true }) public ngtDropzoneFileViewer: NgtDropzoneFileViewerComponent;

    // Visual
    @Input() public label: string;
    @Input() public placeholder: string;
    @Input() public helpTitle: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helpText: boolean = false;

    // Behavior
    @Input() public resources: Array<NgtDropzoneFile> = [];
    @Input() public multipleSelection: boolean = false;
    @Input() public itemsLimit: number;
    @Input() public showFileName: boolean = false;
    @Input() public disableClick: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public viewMode: boolean = false;
    @Input() public removable: boolean = false;
    @Input() public verticalExpandable: boolean = false;
    @Input() public acceptedFiles: string = '*' /** Mime type */;
    @Input() public maxFileSize: number; /** Bytes */
    @Input() public previewType: NgtDropzonePreviewType = NgtDropzonePreviewType.DEFAULT;
    @Input() public isRequired: boolean = false;
    @Input() public name: string;
    @Input() public remoteResource: any;

    @Output() public onFileSelected: EventEmitter<NgxDropzoneChangeEvent> = new EventEmitter();
    @Output() public onFileSelectError: EventEmitter<NgtDropzoneErrorType> = new EventEmitter();
    @Output() public onFileUploadFail: EventEmitter<any> = new EventEmitter();
    @Output() public onFileRemoved = new EventEmitter();
    @Output() public onFileUploaded = new EventEmitter();
    @Output() public onFilePreviewLoaded = new EventEmitter();

    public uploadedResources = [];
    public forceDisableClick: boolean = false;
    public ngtDropzoneFileTypeEnum = NgtDropzoneFileTypeEnum;
    public nativeValue = [];
    public shining: boolean;
    public showNgtDropzoneFileViewer: boolean = false;
    public componentReady = false;
    public loading: boolean = false;
    public ngtDropzoneLoaderStyle: NgtStylizableService;
    public imageViewerOptions: any = {
        navbar: true,
        toolbar: {
            zoomIn: true,
            zoomOut: true,
            reset: true,
            rotateLeft: true,
            rotateRight: true,
            prev: true,
            next: true,
        }
    };

    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @Host()
        public formContainer: ControlContainer,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent,
        private ngtAttachmentHttpService: NgtAttachmentHttpService,
        private injector: Injector,
    ) {
        super();

        if (this.ngtFormComponent) {
            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }

        this.ngtDropzoneLoaderStyle = new NgtStylizableService();
        this.ngtDropzoneLoaderStyle.load(this.injector, 'NgtDropzoneLoader', {
            h: 'h-8',
            color: {
                text: 'text-gray-600'
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.previewType) {
            this.previewType = getEnumFromString(changes.previewType.currentValue, NgtDropzonePreviewType);
        }
    }

    public ngOnInit() {
        setTimeout(() => {
            this.componentReady = true;

            setTimeout(() => {
                this.initComponent();
            });
        }, 500);
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public onImageClick(element, index?) {
        if (!this.viewMode) {
            this.forceDisableClick = true;
        }

        const ngtDropzoneComponent = this;

        const viewer = new Viewer(element, {
            ...this.imageViewerOptions, ...{
                initialViewIndex: index,
                hidden() {
                    ngtDropzoneComponent.forceDisableClick = false;
                    viewer.destroy();
                }
            }
        });

        viewer.show();
    }

    public onFileClick(url, name) {
        this.forceDisableClick = true;
        this.showNgtDropzoneFileViewer = true;
        this.ngtDropzoneFileViewer.url = url;
        this.ngtDropzoneFileViewer.fileName = name;
        this.ngtDropzoneFileViewer.init();

        this.subscriptions.push(this.ngtDropzoneFileViewer.onClose.subscribe(() => {
            this.showNgtDropzoneFileViewer = false;
            this.forceDisableClick = false;
        }));
    }

    public async onSelect(event: NgxDropzoneChangeEvent) {
        if (event.rejectedFiles.length) {
            for (const rejectedFile of <any>event.rejectedFiles) {
                if (rejectedFile.reason == 'size') {
                    this.onFileSelectError.emit(NgtDropzoneErrorType.SIZE);
                    break;
                } else if (rejectedFile.reason == 'no_multiple') {
                    this.onFileSelectError.emit(NgtDropzoneErrorType.NO_MULTIPLE);
                    break;
                } else if (rejectedFile.reason == 'type') {
                    this.onFileSelectError.emit(NgtDropzoneErrorType.TYPE);
                    break;
                } else {
                    this.onFileSelectError.emit(NgtDropzoneErrorType.DEFAULT);
                    break;
                }
            }
        }

        if (this.itemsLimit) {
            if (this.itemsLimit == 1 && event.addedFiles
                && event.addedFiles.length == this.itemsLimit && this.uploadedResources.length == this.itemsLimit) {
                this.uploadedResources = [];
            }

            if (event.addedFiles
                && event.addedFiles.length + this.uploadedResources.length <= this.itemsLimit) {
                this.onFileSelected.emit(event);
                this.uploadFiles(event.addedFiles);
            } else {
                this.onFileSelectError.emit(NgtDropzoneErrorType.ITEMS_LIMIT);
            }
        } else {
            this.onFileSelected.emit(event);
            this.uploadFiles(event.addedFiles);
        }
    }

    public async uploadFiles(files: Array<File>) {
        if (files && files.length) {
            let temporaryFiles = [];
            let temporaryAttachments = [];
            let observables = [];

            this.loading = true;

            files.forEach(file => {
                observables.push(this.ngtAttachmentHttpService.upload(this.remoteResource, file).pipe(
                    map((response: any) => {
                        if (response && response.data) {
                            if (response.data.attributes && response.data.attributes.data) {
                                file['url'] = response.data.attributes.data.url;
                            }

                            temporaryFiles.push({
                                id: response.data.id,
                                size: file.size,
                                file: file
                            });
                            response.data['loaded'] = true;
                            temporaryAttachments.push(response.data);
                        }
                    })
                ));
            });

            this.subscriptions.push(
                forkJoin(observables).subscribe(
                    (response) => {
                        this.uploadedResources.push(...temporaryFiles);

                        if (this.itemsLimit == 1) {
                            this.onNativeChange([...temporaryAttachments]);
                        } else {
                            this.onNativeChange([...temporaryAttachments, ...this.nativeValue]);
                        }

                        this.onFileUploaded.emit();
                        this.loading = false;
                    },
                    (error) => {
                        this.onFileUploadFail.emit(error);
                        this.loading = false;
                    })
            );
        }
    }

    public async loadFilePreview(attachments: any) {
        if (attachments && attachments.length && attachments[0]) {
            let temporaryResource = [];
            let observables = [];

            attachments.forEach(attachment => {
                if (!(attachment instanceof File) && !attachment.loaded) {
                    this.loading = true;
                    attachment['loaded'] = true;
                    observables.push(this.ngtAttachmentHttpService.thumbnail(attachment).pipe(
                        map((response: any) => {
                            temporaryResource.push({
                                id: response.data.getApiId(),
                                file: response.data.getAttribute('file')
                            });
                        })
                    ));
                }
            });

            this.subscriptions.push(
                forkJoin(observables).subscribe(
                    (response) => {
                        this.uploadedResources.push(...temporaryResource);
                        this.onNativeChange(attachments);
                        this.onFilePreviewLoaded.emit();
                        this.loading = false;
                    },
                    (error) => {
                        this.loading = false;
                    })
            );
        }
    }

    public onRemove(resource: any) {
        this.uploadedResources.splice(this.uploadedResources.indexOf(resource), 1);
        this.nativeValue = this.nativeValue.filter(element => element.id != resource.id);
        this.onNativeChange(this.nativeValue);
        this.onFileRemoved.emit(resource);
    }

    public isImage(resource: any) {
        return this.previewType == 'IMAGE' || (resource.file && resource.file.type && resource.file.type.includes('image'));
    }

    public isVideo(resource: any) {
        return this.previewType == 'VIDEO' || (resource.file && resource.file.type && resource.file.type.includes('video'));
    }

    public isAudio(resource: any) {
        return (resource.file && resource.file.type && resource.file.type.includes('audio'));
    }

    public isFile(resource: any) {
        return !this.isImage(resource) && !this.isAudio(resource) && !this.isVideo(resource);
    }

    public getFormattedFileSize(size) {
        if (size > 1000000) {
            return (size / 1000000).toFixed(2) + ' Mb';
        }

        return Math.round(size / 1000) + ' Kb';
    }

    public onNativeChange(value: any) {
        if (value === undefined) {
            this.value = [];
            this.nativeValue = [];
        } else {
            this.nativeValue = value;

            if (JSON.stringify(this.value) != JSON.stringify(this.nativeValue)) {
                this.value = this.nativeValue;
            }
        }
    }

    public change(value: any) {
        if (value && !this.viewMode) {
            this.onNativeChange(Array.isArray(value) ? value : [value]);

            if (this.componentReady) {
                this.loadFilePreview(Array.isArray(value) ? value : [value]);
            }
        }
    }

    public downloadFile(attachment: any) {
        this.ngtAttachmentHttpService.download(attachment).subscribe(() => { });
    }

    public reset() {
        this.uploadedResources = [];
        this.value = [];
        this.nativeValue = [];
        this.initComponent();
    }

    public openFileSelector() {
        document.getElementById('ngxDropzone').click();
    }

    private initComponent() {
        if (this.viewMode) {
            this.previewType = NgtDropzonePreviewType.DEFAULT;

            return;
        }

        if (this.formContainer && this.formContainer.control
            && (this.formControl = this.formContainer.control.get(this.name))) {
            this.resetFilesLoad();
            this.loadFilePreview(Array.isArray(this.value) ? this.value : [this.value]);
            this.updateValidations();

            if (this.value) {
                this.formControl.markAsDirty();
            } else {
                this.formControl.markAsPristine();
            }
        }
    }

    private resetFilesLoad() {
        if (Array.isArray(this.value)) {
            this.value.forEach(element => {
                if (element) {
                    element['loaded'] = false;
                }
            });
        }
    }

    private updateValidations() {
        if (!this.formControl) {
            return;
        }

        let syncValidators = [];

        if (this.isRequired) {
            syncValidators.push(Validators.required);
        }

        syncValidators.push();

        setTimeout(() => {
            this.formControl.setValidators(syncValidators);
            this.formControl.updateValueAndValidity();
        });
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtDropzonePreviewType {
    DEFAULT = 'DEFAULT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
}

export enum NgtDropzoneErrorType {
    DEFAULT = 'DEFAULT',
    SIZE = 'SIZE',
    NO_MULTIPLE = 'NO_MULTIPLE',
    ITEMS_LIMIT = 'ITEMS_LIMIT',
    TYPE = 'TYPE'
}

enum NgtDropzoneFileTypeEnum {
    IMAGE = 'IMAGE',
    ARCHIVE = 'ARCHIVE'
}
