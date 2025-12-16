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
    WritableSignal,
} from '@angular/core';
import { AsyncValidatorFn, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDropzoneChangeEvent, NgxDropzoneComponent, NgxDropzoneModule } from 'ngx-dropzone';

import { NgtControlValueAccessor, NgtValueAccessorProvider } from '../../../../base/ngt-control-value-accessor';
import { uuid } from '../../../../helpers/uuid';
import { NgtDropzoneErrorType, NgtDropzoneFile, NgtDropzonePreviewType } from '../../../../meta/ngt-dropzone.meta';
import { NgtReactiveFormComponent } from '../ngt-reactive-form/ngt-reactive-form.component';
import { NgtSectionComponent } from '../../../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../../../ngt-modal/ngt-modal.component';
import { NgtValidationModule } from '../../../ngt-validation/ngt-validation.module';
import { NgtReactiveDropzoneValidationService } from './services/ngt-reactive-dropzone-validation.service';
import { NgtReactiveDropzoneFileService, UploadFilesResult } from './services/ngt-reactive-dropzone-file.service';
import { ErrorValidationResult, NgtReactiveDropzoneErrorService } from './services/ngt-reactive-dropzone-error.service';
import { NgtReactiveDropzoneViewerService } from './services/ngt-reactive-dropzone-viewer.service';
import { NgtReactiveDropzoneStateService } from './services/ngt-reactive-dropzone-state.service';
import { CustomDropzonePreviewComponent } from '../../../shared/custom-dropzone-preview/custom-dropzone-preview.component';
import { NgtDropzoneFileViewerComponent } from '../../../shared/ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneViewComponent } from '../../../shared/ngt-dropzone-view/ngt-dropzone-view.component';
import { NgtHelperComponent } from '../../../ngt-helper/ngt-helper.component';

@Component({
    selector: 'ngt-reactive-dropzone',
    templateUrl: './ngt-reactive-dropzone.component.html',
    styleUrls: ['./ngt-reactive-dropzone.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [
        NgtValueAccessorProvider(NgtReactiveDropzoneComponent),

        NgtReactiveDropzoneValidationService,
        NgtReactiveDropzoneFileService,
        NgtReactiveDropzoneErrorService,
        NgtReactiveDropzoneViewerService,
        NgtReactiveDropzoneStateService,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxDropzoneModule,
        NgtValidationModule,
        NgtHelperComponent,

        CustomDropzonePreviewComponent,
        NgtDropzoneFileViewerComponent,
        NgtDropzoneViewComponent,
    ],
})
export class NgtReactiveDropzoneComponent extends NgtControlValueAccessor implements AfterViewInit {
    @ViewChild('container', { static: false }) public container: ElementRef;
    @ViewChild(NgxDropzoneComponent, { static: true }) public ngxDropzone: NgxDropzoneComponent;
    @ViewChild(NgtDropzoneFileViewerComponent, { static: true }) public fileViewer: NgtDropzoneFileViewerComponent;

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
    public readonly isDisabled = input<boolean>(false);
    public readonly viewMode = input<boolean>(false);
    public readonly removable = input<boolean>(false);
    public readonly canDownloadFile = input<boolean>(true);
    public readonly verticalExpandable = input<boolean>(false);
    public readonly hideNgxDropzone = input<boolean>(false);
    public readonly acceptedFiles = input<string>('*'); /** Mime type */
    public readonly unacceptedFiles = input<string>(); /** Mime type */
    public readonly maxFileSize = input<number>(); /** Bytes */
    public readonly previewType = input<NgtDropzonePreviewType>(NgtDropzonePreviewType.DEFAULT);
    public readonly remoteResource = input<any>();

    /** Validation Inputs */

    public readonly isRequired = input<boolean>(false);
    public readonly customSyncValidators = input<ValidatorFn[]>();
    public readonly customAsyncValidators = input<AsyncValidatorFn[]>();

    /** Outputs */

    public readonly onFileSelected = output<NgxDropzoneChangeEvent>();
    public readonly onFileSelectError = output<NgtDropzoneErrorType>();
    public readonly onFileUploadFail = output<any>();
    public readonly onFileRemoved = output<any>();
    public readonly onFileUploadInit = output<void>();
    public readonly onFileUploaded = output<void>();
    public readonly onFilePreviewLoaded = output<void>();
    public readonly onValueChange = output<any>();

    /** Computed Signals */

    public readonly isDisabledByParent: Signal<boolean> = computed(
        () => this.ngtForm?.isDisabledState() || this.ngtSection?.isDisabledState() || this.ngtModal?.isDisabledState()
    );

    public readonly isDisabledState: Signal<boolean> = computed(
        () => this.isDisabled() || this.isDisabledByParent()
    );

    public readonly shouldDisableClick: Signal<boolean> = computed(
        () => this.disableClick() || this.stateService.forceDisableClick()
    );

    public readonly currentValue: Signal<any> = computed(() => this.value);

    public readonly isLoading: Signal<boolean> = computed(
        () => this.stateService.loading()
    );

    public readonly isShining: Signal<boolean> = computed(
        () => this.stateService.shining() || this.ngtForm?.shining()
    );

    /** File Viewer */

    public showFileViewer: WritableSignal<boolean> = signal(false);
    public fileViewerUrl: WritableSignal<string> = signal('');
    public fileViewerFileName: WritableSignal<string> = signal('');
    public fileViewerFileSize: WritableSignal<number> = signal(0);

    /** Internal Control */

    public readonly ngxElementId: string = uuid();

    public constructor(
        @Optional() @SkipSelf()
        private ngtForm: NgtReactiveFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent,

        private validationService: NgtReactiveDropzoneValidationService,
        private fileService: NgtReactiveDropzoneFileService,
        private errorService: NgtReactiveDropzoneErrorService,
        private viewerService: NgtReactiveDropzoneViewerService,
        private stateService: NgtReactiveDropzoneStateService,

        private changeDetector: ChangeDetectorRef,
        protected override injector: Injector,
    ) {
        super();

        this.registerEffects();
    }

    public get dropzoneHeight(): string {
        return this.stateService.dropzoneHeight();
    }

    public get uploadedResources(): any[] {
        return this.stateService.uploadedResources();
    }

    public ngAfterViewInit(): void {
        this.formControl = this.getControl();

        this.setupComponent();

        setTimeout(() => this.stateService.componentReady.set(true), 500);
    }

    public onSelectFiles(event: NgxDropzoneChangeEvent): void {
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

        this.uploadFiles(event.addedFiles);
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
        this.showFileViewer.set(true);

        this.fileViewerUrl.set(url);
        this.fileViewerFileName.set(name);
        this.fileViewerFileSize.set(size);

        this.fileViewer.init();
    }

    public onCloseFileViewer(): void {
        this.showFileViewer.set(false);
        this.stateService.forceDisableClick.set(false);
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

    public reset(): void {
        this.stateService.reset();
        this.value = [];
        this.setupComponent();
    }

    public openFileSelector(): void {
        document.getElementById(this.ngxElementId)?.click();
    }

    public imagePreview(index: number): void {
        const imagesDiv = this.viewerService.createImagePreview(
            this.stateService.uploadedResources(),
            (resource) => this.fileService.isImage(resource, this.previewType())
        );

        this.onImageClick(imagesDiv, index);
    }

    public onNativeChange(value: any): void {
        this.stateService.nativeValue.set(value ?? []);

        if (this.hasChangesBetweenValues(this.value, this.stateService.nativeValue())) {
            this.onTouched();

            this.value = this.stateService.nativeValue();
        }
    }

    public change(value: any): void {
        if (value && !this.viewMode()) {
            value = Array.isArray(value) ? value : [value];

            if (this.hasChangesBetweenValues(this.value, this.stateService.nativeValue())) {
                this.onNativeChange(value);
            }

            if (
                this.formControl
                && this.hasChangesBetweenValues(this.value, this.formControl.value)
            ) {
                this.formControl.setValue(value);

                this.onValueChange.emit(value);
            }

            if (this.stateService.componentReady()) {
                this.loadFilePreview(value);
            }
        }
    }

    public getFormattedFileSize(resource: any): string {
        return this.fileService.getFormattedFileSize(resource);
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

    private async uploadFiles(files: File[]): Promise<void> {
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

    private async loadFilePreview(attachments: any[]): Promise<void> {
        if (!attachments?.length) {
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

    private registerEffects(): void {
        effect(() => this.setupValidators());
    }

    private setupComponent(): void {
        this.setupValidators();

        if (this.value) {
            this.fileService.resetFilesLoad(Array.isArray(this.value) ? this.value : [this.value]);
            this.loadFilePreview(Array.isArray(this.value) ? this.value : [this.value]);
        }
    }

    private setupValidators(): void {
        if (!this.formControl) {
            return;
        }

        const syncValidators = this.validationService.getSyncValidators({
            isRequired: this.isRequired(),
            customSyncValidators: this.customSyncValidators(),
        });

        const asyncValidators = this.customAsyncValidators() ?? [];

        this.formControl.setValidators(syncValidators);
        this.formControl.setAsyncValidators(asyncValidators);
        this.formControl.updateValueAndValidity();

        if (this.value) {
            this.markAsDirty();
        }
    }

    private hasChangesBetweenValues(a: any, b: any): boolean {
        return JSON.stringify(a) !== JSON.stringify(b);
    }
}
