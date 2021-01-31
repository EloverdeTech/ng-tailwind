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

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtAttachmentHttpService } from '../../services/http/ngt-attachment-http.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtDropzoneFileViewerComponent } from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';

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
    @Input() public resources = [];
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
                && event.addedFiles.length == this.itemsLimit && this.resources.length == this.itemsLimit) {
                this.resources = [];
            }

            if (event.addedFiles
                && event.addedFiles.length + this.resources.length <= this.itemsLimit) {
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
                        this.resources.push(...temporaryFiles);

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
                    observables.push(this.ngtAttachmentHttpService.preview(attachment).pipe(
                        map((response: any) => {
                            temporaryResource.push({
                                id: response.data.getApiId(),
                                file: response.data.getAttribute('file')
                            });
                        })
                    )
                    );
                }
            });

            this.subscriptions.push(
                forkJoin(observables).subscribe(
                    (response) => {
                        this.resources.push(...temporaryResource);
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
        this.resources.splice(this.resources.indexOf(resource), 1);
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

    public getImages() {
        const images = this.resources.filter((resource: any) => this.isImage(resource));

        return this.removeArrayDuplicates(images);
    }

    public getAudios() {
        const audios = this.resources.filter((resource: any) => this.isAudio(resource));

        return this.removeArrayDuplicates(audios);
    }

    public getVideos() {
        const videos = this.resources.filter((resource: any) => this.isVideo(resource));

        return this.removeArrayDuplicates(videos);
    }

    public getArchives() {
        const files = this.resources.filter((resource: any) => !this.isAudio(resource) && !this.isImage(resource) && !this.isVideo(resource));

        return this.removeArrayDuplicates(files);
    }

    public getFormattedFileSize(resource: any) {
        if (resource.size > 1000000) {
            return (resource.size / 1000000).toFixed(2) + ' Mb';
        }

        return Math.round(resource.size / 1000) + ' Kb';
    }

    public openDocViewer(resource: any) {
        this.showNgtDropzoneFileViewer = true;

        this.ngtDropzoneFileViewer.url = resource.file.url;
        this.ngtDropzoneFileViewer.fileName = resource.file.name;
        this.ngtDropzoneFileViewer.init();

        this.subscriptions.push(this.ngtDropzoneFileViewer.onClose.subscribe(() => {
            this.showNgtDropzoneFileViewer = false;
        }));
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
        if (value) {
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
        this.resources = [];
        this.value = [];
        this.nativeValue = [];
        this.initComponent();
    }

    public openFileSelector() {
        if (this.ngxDropzone) {
            this.ngxDropzone.showFileSelector();
        }
    }

    private initComponent() {
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

            if (this.viewMode) {
                this.previewType = NgtDropzonePreviewType.DEFAULT;
            }
        }
    }

    private resetFilesLoad() {
        if (Array.isArray(this.value)) {
            this.value.forEach(element => {
                element['loaded'] = false;
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

    private removeArrayDuplicates(array: Array<{ id: any; file: any }>): Array<any> {
        return array.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.id === item.id
            ))
        );
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
