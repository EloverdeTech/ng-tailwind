import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    Injector,
    input,
    Optional,
    output,
    Signal,
    signal,
    SkipSelf,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { NgxDropzoneChangeEvent, NgxDropzoneComponent } from 'ngx-dropzone';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { getEnumFromString } from '../../../../helpers/enum/enum';
import { uuid } from '../../../../helpers/uuid';
import { NgtStylizableService } from '../../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtDropzoneFileViewerComponent } from '../../../shared/ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneErrorType, NgtDropzoneFile, NgtDropzonePreviewType } from '../../../../meta/ngt-dropzone.meta';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtDropzoneStateService } from './services/ngt-dropzone-state.service';
import { NgtDropzoneFileService, UploadFilesResult } from './services/ngt-dropzone-file.service';
import { ErrorValidationResult, NgtDropzoneErrorService } from './services/ngt-dropzone-error.service';
import { NgtDropzoneViewerService } from './services/ngt-dropzone-viewer.service';

@Component({
    selector: 'ngt-dropzone',
    templateUrl: './ngt-dropzone.component.html',
    styleUrls: ['./ngt-dropzone.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtValueAccessorProvider(NgtDropzoneComponent),

        NgtDropzoneStateService,
        NgtDropzoneFileService,
        NgtDropzoneErrorService,
        NgtDropzoneViewerService,
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    standalone: false
})
export class NgtDropzoneComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('container', { static: false }) public container: ElementRef;
    @ViewChild(NgxDropzoneComponent, { static: true }) public ngxDropzone: NgxDropzoneComponent;
    @ViewChild(NgtDropzoneFileViewerComponent, { static: true }) public ngtDropzoneFileViewer: NgtDropzoneFileViewerComponent;

    /** Visual Inputs */

    public readonly label = input<string>();
    public readonly placeholder = input<string>('');
    public readonly helpTextColor = input<string>('text-green-500');
    public readonly helpText = input<string>();
    public readonly helpTitle = input<string>();

    /** Behavior Inputs */

    public readonly resources = input<Array<NgtDropzoneFile>>([]);
    public readonly multipleSelection = input<boolean>(false);
    public readonly itemsLimit = input<number>();
    public readonly showFileName = input<boolean>(false);
    public readonly disableClick = input<boolean>(false);
    public readonly disabled = input<boolean>(false);
    public readonly viewMode = input<boolean>(false);
    public readonly removable = input<boolean>(false);
    public readonly canDownloadFile = input<boolean>(true);
    public readonly verticalExpandable = input<boolean>(false);
    public readonly hideNgxDropzone = input<boolean>(false);
    public readonly acceptedFiles = input<string>('*'); /** Mime type */
    public readonly unacceptedFiles = input<string>(); /** Mime type */
    public readonly maxFileSize = input<number>(); /** Bytes */
    public readonly previewType = input<NgtDropzonePreviewType>(NgtDropzonePreviewType.DEFAULT);
    public readonly name = input<string>();
    public readonly remoteResource = input<any>();

    /** Validation Inputs */

    public readonly isRequired = input<boolean>(false);

    /** Outputs */

    public readonly onFileSelected = output<NgxDropzoneChangeEvent>();
    public readonly onFileSelectError = output<NgtDropzoneErrorType>();
    public readonly onFileUploadFail = output<any>();
    public readonly onFileRemoved = output<any>();
    public readonly onFileUploadInit = output<void>();
    public readonly onFileUploaded = output<void>();
    public readonly onFilePreviewLoaded = output<void>();

    /** Computed Signals */

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => !!this.ngtForm?.isDisabled() || !!this.ngtSection?.isDisabledState() || !!this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.disabled() || this.isDisabledByParent()
    );

    public readonly shouldDisableClick: Signal<boolean> = computed(
        () => this.disableClick() || this.stateService.forceDisableClick()
    );

    public readonly dropzoneHeight: Signal<string> = computed(
        () => this.stateService.dropzoneHeight()
    );

    public readonly uploadedResources: Signal<any[]> = computed(
        () => this.stateService.uploadedResources()
    );

    public readonly showNgtDropzoneFileViewer: Signal<boolean> = computed(
        () => this.stateService.showFileViewer()
    );

    public readonly componentReady: Signal<boolean> = computed(
        () => this.stateService.componentReady()
    );

    public readonly loading: Signal<boolean> = computed(
        () => this.stateService.loading()
    );

    /** File Viewer */

    public fileViewerUrl: WritableSignal<string> = signal('');
    public fileViewerFileName: WritableSignal<string> = signal('');
    public fileViewerFileSize: WritableSignal<number> = signal(0);

    /** Internal Control */

    public readonly ngxElementId: string = uuid();
    public readonly ngtDropzoneLoaderStyle: NgtStylizableService;

    public constructor(
        public formContainer: ControlContainer,

        private changeDetector: ChangeDetectorRef,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        private stateService: NgtDropzoneStateService,
        private fileService: NgtDropzoneFileService,
        private errorService: NgtDropzoneErrorService,
        private viewerService: NgtDropzoneViewerService,

        protected override injector: Injector,
    ) {
        super();

        this.ngtDropzoneLoaderStyle = new NgtStylizableService();

        this.ngtDropzoneLoaderStyle.load(this.injector, 'NgtDropzoneLoader', {
            h: 'h-8',
            color: {
                text: 'text-gray-600'
            }
        });

        this.registerEffects();
    }

    public ngAfterViewInit(): void {
        this.setupContainerHeight();

        setTimeout(() => {
            this.stateService.componentReady.set(true);

            setTimeout(() => {
                this.initComponent();
            });
        }, 500);
    }

    public imagePreview(index: number): void {
        const imagesDiv = this.viewerService.createImagePreview(
            this.stateService.uploadedResources(),
            (resource) => this.fileService.isImage(resource, this.previewType())
        );

        this.onImageClick(imagesDiv, index);
    }

    public onImageClick(element: HTMLElement, index?: number): void {
        if (!this.viewMode()) {
            this.stateService.forceDisableClick.set(true);
        }

        this.viewerService.showViewer(
            element,
            index,
            () => this.stateService.forceDisableClick.set(false)
        );
    }

    public onFileClick(url: string, name: string, size: number): void {
        this.stateService.forceDisableClick.set(true);
        this.stateService.showFileViewer.set(true);

        this.fileViewerUrl.set(url);
        this.fileViewerFileName.set(name);
        this.fileViewerFileSize.set(size);

        this.ngtDropzoneFileViewer.init();
    }

    public onCloseFileViewer(): void {
        this.stateService.showFileViewer.set(false);
        this.stateService.forceDisableClick.set(false);
    }

    public async onSelect(event: NgxDropzoneChangeEvent): Promise<void> {
        const errorResult: ErrorValidationResult = this.errorService.validateRejectedFiles(event);

        if (errorResult.hasError) {
            return this.onFileSelectError.emit(errorResult.errorType);
        }

        const limit = this.itemsLimit();

        if (limit) {
            const shouldClearExistingResources = this.errorService.shouldClearExistingResources(
                limit,
                event.addedFiles?.length || 0,
                this.stateService.uploadedResources().length
            );

            if (shouldClearExistingResources) {
                this.stateService.uploadedResources.set([]);
            }

            const limitResult: ErrorValidationResult = this.errorService.validateItemsLimit(
                event.addedFiles?.length || 0,
                this.stateService.uploadedResources().length,
                limit
            );

            if (limitResult.hasError) {
                return this.onFileSelectError.emit(limitResult.errorType);
            }
        }

        this.onFileSelected.emit(event);

        await this.uploadFiles(event.addedFiles);
    }

    public async uploadFiles(files: File[]): Promise<void> {
        if (!files?.length) {
            return;
        }

        this.stateService.loading.set(true);
        this.onFileUploadInit.emit();

        try {
            const result: UploadFilesResult = await this.fileService.uploadFiles(
                files,
                this.remoteResource(),
                this.unacceptedFiles()
            );

            setTimeout(() => this.changeDetector.detectChanges(), 500);

            if (!result.uploadedFiles.length && result.unacceptedFiles.length) {
                this.stateService.loading.set(false);

                return this.onFileSelectError.emit(NgtDropzoneErrorType.TYPE);
            }

            this.stateService.uploadedResources.set([
                ...this.stateService.uploadedResources(),
                ...result.uploadedFiles
            ]);

            if (this.itemsLimit() === 1) {
                this.onNativeChange([...result.uploadedAttachments]);
            } else {
                this.onNativeChange([
                    ...result.uploadedAttachments,
                    ...this.stateService.nativeValue()
                ]);
            }

            this.onFileUploaded.emit();
            this.stateService.loading.set(false);

            if (result.unacceptedFiles.length) {
                this.onFileSelectError.emit(NgtDropzoneErrorType.TYPE);
            }
        } catch (error) {
            this.onFileUploadFail.emit(error);
            this.stateService.loading.set(false);
        }
    }

    public async loadFilePreview(attachments: any[]): Promise<void> {
        if (!attachments?.length || !attachments[0]) {
            return;
        }

        this.stateService.loading.set(true);

        try {
            const loadedResources: any[] = await this.fileService.loadFilePreview(attachments);

            if (loadedResources.length) {
                this.stateService.uploadedResources.set([
                    ...this.stateService.uploadedResources(),
                    ...loadedResources
                ]);

                this.onNativeChange(attachments);
                this.onFilePreviewLoaded.emit();
            }

            this.stateService.loading.set(false);
        } catch (error) {
            this.stateService.loading.set(false);
        }

        setTimeout(() => this.changeDetector.detectChanges(), 500);
    }

    public onRemove(resource: any): void {
        this.stateService.uploadedResources.set(
            this.stateService.uploadedResources().filter(r => r !== resource)
        );

        this.stateService.nativeValue.set(
            this.stateService.nativeValue().filter(element => element.id !== resource.id)
        );

        this.onNativeChange(this.stateService.nativeValue());
        this.onFileRemoved.emit(resource);
    }

    public isImage(resource: any): boolean {
        return this.fileService.isImage(resource, this.previewType());
    }

    public isVideo(resource: any): boolean {
        return this.fileService.isVideo(resource, this.previewType());
    }

    public isAudio(resource: any): boolean {
        return this.fileService.isAudio(resource);
    }

    public isFile(resource: any): boolean {
        return this.fileService.isFile(resource, this.previewType());
    }

    public getFormattedFileSize(resource: any): string {
        return this.fileService.getFormattedFileSize(resource);
    }

    public onNativeChange(value: any): void {
        if (value === undefined) {
            this.value = [];
            this.stateService.nativeValue.set([]);
        } else {
            this.stateService.nativeValue.set(value);

            if (this.hasChangesBetweenValues(this.value, this.stateService.nativeValue())) {
                this.value = this.stateService.nativeValue();
            }
        }
    }

    public change(value: any): void {
        if (value && !this.viewMode()) {
            this.onNativeChange(Array.isArray(value) ? value : [value]);

            if (this.stateService.componentReady()) {
                this.loadFilePreview(Array.isArray(value) ? value : [value]);
            }
        }
    }

    public downloadFile(attachment: any): void {
        this.fileService.downloadFile(attachment).subscribe(() => { });
    }

    public reset(): void {
        this.stateService.reset();
        this.value = [];
        this.initComponent();
    }

    public openFileSelector(): void {
        document.getElementById(this.ngxElementId)?.click();
    }

    public isDisabled(): boolean {
        return this.isDisabledState();
    }

    private registerEffects(): void {
        effect(() => this.setupValidators());

        effect(() => {
            const previewTypeValue = this.previewType();

            if (this.viewMode()) {
                getEnumFromString(previewTypeValue as string, NgtDropzonePreviewType);
            }
        });

        effect(() => {
            if (this.container?.nativeElement) {
                this.setupContainerHeight();
            }
        });
    }

    private setupContainerHeight(): void {
        if (this.container?.nativeElement?.parentElement) {
            this.stateService.dropzoneHeight.set(
                `${this.container.nativeElement.parentElement.offsetHeight}px`
            );

            this.changeDetector.detectChanges();
        }
    }

    private initComponent(): void {
        if (this.viewMode()) {
            return;
        }

        if (this.formContainer?.control
            && (this.formControl = this.formContainer.control.get(this.name()))) {
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

    private resetFilesLoad(): void {
        if (Array.isArray(this.value)) {
            this.fileService.resetFilesLoad(this.value);
        }
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const syncValidators = [];

        if (this.isRequired()) {
            syncValidators.push(Validators.required);
        }

        this.formControl.setValidators(syncValidators);
        this.formControl.updateValueAndValidity();
    }

    private updateValidations(): void {
        this.setupValidators();
    }

    private hasChangesBetweenValues(a: any, b: any): boolean {
        return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
    }
}
