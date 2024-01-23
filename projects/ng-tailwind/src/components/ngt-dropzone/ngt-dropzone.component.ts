import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
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
import { uuid } from '../../helpers/uuid';
import { NgtAttachmentHttpService } from '../../services/http/ngt-attachment-http.service';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtDropzoneFileViewerComponent } from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneErrorType, NgtDropzoneFile, NgtDropzonePreviewType } from './ngt-dropzone.meta';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';

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
export class NgtDropzoneComponent extends NgtBaseNgModel implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('container') public container: ElementRef;
    @ViewChild(NgxDropzoneComponent, { static: true }) public ngxDropzone: NgxDropzoneComponent;
    @ViewChild(NgtDropzoneFileViewerComponent, { static: true }) public ngtDropzoneFileViewer: NgtDropzoneFileViewerComponent;

    // Visual
    @Input() public label: string;
    @Input() public placeholder: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helpText: string;
    @Input() public helpTitle: string;

    // Behavior
    @Input() public resources: Array<NgtDropzoneFile> = [];
    @Input() public multipleSelection: boolean = false;
    @Input() public itemsLimit: number;
    @Input() public showFileName: boolean = false;
    @Input() public disableClick: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public viewMode: boolean = false;
    @Input() public removable: boolean = false;
    @Input() public canDownloadFile: boolean = true;
    @Input() public verticalExpandable: boolean = false;
    @Input() public isRequired: boolean;
    @Input() public hideNgxDropzone: boolean;
    @Input() public acceptedFiles: string = '*' /** Mime type */;
    @Input() public unacceptedFiles: string; /** Mime type */;
    @Input() public maxFileSize: number; /** Bytes */;
    @Input() public previewType: NgtDropzonePreviewType = NgtDropzonePreviewType.DEFAULT;
    @Input() public name: string;
    @Input() public remoteResource: any;

    @Output() public onFileSelected: EventEmitter<NgxDropzoneChangeEvent> = new EventEmitter();
    @Output() public onFileSelectError: EventEmitter<NgtDropzoneErrorType> = new EventEmitter();
    @Output() public onFileUploadFail: EventEmitter<any> = new EventEmitter();
    @Output() public onFileRemoved = new EventEmitter();
    @Output() public onFileUploadInit = new EventEmitter();
    @Output() public onFileUploaded = new EventEmitter();
    @Output() public onFilePreviewLoaded = new EventEmitter();

    public dropzoneHeight: string = '180px';
    public uploadedResources = [];
    public forceDisableClick: boolean = false;
    public nativeValue = [];
    public showNgtDropzoneFileViewer: boolean = false;
    public componentReady = false;
    public loading: boolean = false;
    public ngtDropzoneLoaderStyle: NgtStylizableService;
    public ngxElementId: string = uuid();
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

        private injector: Injector,
        private changeDetector: ChangeDetectorRef,

        @Optional() @SkipSelf()
        private ngtAttachmentHttpService: NgtAttachmentHttpService,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent
    ) {
        super();

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

    public ngAfterContentChecked() {
        if (this.container && this.container.nativeElement) {
            this.dropzoneHeight = `${this.container.nativeElement.parentElement.offsetHeight}px`;

            this.changeDetector.detectChanges();
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

    public imagePreview(index) {
        const images = this.uploadedResources.filter((resource) => this.isImage(resource));
        const imagesDiv = document.createElement("div");

        images.forEach((image) => {
            let imageElement = document.createElement("img");

            imageElement.src = image.file.url;

            imagesDiv.appendChild(imageElement);
        });

        this.onImageClick(imagesDiv, index);
    }

    public onImageClick(element, index?) {
        if (!this.viewMode) {
            this.forceDisableClick = true;
        }

        const ngtDropzoneComponent = this;

        if (index !== null && index !== undefined) {
            this.imageViewerOptions = { ...this.imageViewerOptions, ...{ initialViewIndex: index } };
        }

        const viewer = new Viewer(element, {
            ...this.imageViewerOptions, ...{
                hidden() {
                    ngtDropzoneComponent.forceDisableClick = false;
                    viewer.destroy();
                }
            }
        });

        viewer.show();
    }

    public onFileClick(url: string, name: string, size: number) {
        this.forceDisableClick = true;
        this.showNgtDropzoneFileViewer = true;
        this.ngtDropzoneFileViewer.url = url;
        this.ngtDropzoneFileViewer.fileName = name;
        this.ngtDropzoneFileViewer.fileSize = size;
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
            const temporaryFiles = [];
            const temporaryAttachments = [];
            const observables = [];
            const unacceptedFiles = [];

            this.loading = true;
            this.onFileUploadInit.emit();

            files.forEach(file => {
                if (file.type.includes(this.unacceptedFiles)) {
                    return unacceptedFiles.push(file);
                }

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

            if (!observables.length && unacceptedFiles.length) {
                this.loading = false;

                return this.onFileSelectError.emit(NgtDropzoneErrorType.TYPE);
            }

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

                        if (unacceptedFiles.length) {
                            this.onFileSelectError.emit(NgtDropzoneErrorType.TYPE);
                        }
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

            attachments.forEach((attachment: any) => {
                if (!(attachment instanceof File) && !attachment.loaded) {
                    this.loading = true;

                    attachment['loaded'] = true;

                    observables.push(this.ngtAttachmentHttpService.preview(attachment)
                        .pipe(
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
        return this.previewType == 'IMAGE'
            || (
                resource.file?.type
                && resource.file.type.includes('image')
                && !resource.file.type.includes('dwg')
            );
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

    public getFormattedFileSize(resource: any) {
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
        document.getElementById(this.ngxElementId).click();
    }

    public isDisabled(): boolean {
        return this.disabled || this.isDisabledByParent();
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

    private isDisabledByParent(): boolean {
        return this.ngtForm?.isDisabled
            || this.ngtSection?.isDisabled
            || this.ngtModal?.isDisabled;
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
