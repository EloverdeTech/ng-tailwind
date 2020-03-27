import {
  Component,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NgForm, Validators } from '@angular/forms';
import { NgxDropzoneChangeEvent, NgxDropzoneComponent } from 'ngx-dropzone';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtAttachmentHttpService } from '../../services/http/ngt-attachment-http.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

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
export class NgtDropzoneComponent extends NgtBaseNgModel implements OnInit {
  @ViewChild('ngxDropzone', { static: true }) ngxDropzone: NgxDropzoneComponent;

  @Input() multipleSelection: boolean = false;
  @Input() itemsLimit: number;
  @Input() showFileName: boolean = false;
  @Input() disableClick: boolean = false;
  @Input() disabled: boolean = false;
  @Input() removable: boolean = false;
  @Input() verticalExpandable: boolean = false;
  @Input() acceptedFiles: string = '*' /** Mime type */;
  @Input() maxFileSize: number; /** Bytes */
  @Input() previewType: NgtDropzonePreviewType = NgtDropzonePreviewType.DEFAULT;
  @Input() isRequired: boolean = false;
  @Input() label: string;
  @Input() name: string;
  @Input() remoteResource: any;

  @Output() onFileSelected: EventEmitter<NgxDropzoneChangeEvent> = new EventEmitter();
  @Output() onFileSelectError: EventEmitter<NgtDropzoneErrorType> = new EventEmitter();
  @Output() onFileUploadFail: EventEmitter<any> = new EventEmitter();
  @Output() onFileRemoved = new EventEmitter();
  @Output() onFileUploaded = new EventEmitter();
  @Output() onFilePreviewLoaded = new EventEmitter();

  public resources = [];
  public nativeValue = [];
  public shining: boolean;
  public componentReady = false;
  public loading: boolean = false;

  constructor(
    @Optional() @Host()
    public formContainer: ControlContainer,
    @Optional() @SkipSelf()
    private ngtFormComponent: NgtFormComponent,
    private ngtAttachmentHttpService: NgtAttachmentHttpService,
  ) {
    super();

    if (this.ngtFormComponent) {
      this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
        this.shining = shining;
      });
    }
  }

  ngOnInit() {
    setTimeout(() => { }, 500);
    this.componentReady = true;

    setTimeout(() => {
      this.initComponent();
    });
  }

  async onSelect(event: NgxDropzoneChangeEvent) {
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

  async uploadFiles(files: Array<File>) {
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
                file: file
              });
              response.data['loaded'] = true;
              temporaryAttachments.push(response.data);
            }
          })
        ));
      });

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
        });
    }
  }

  async loadFilePreview(attachments: any) {
    if (attachments && attachments.length && attachments[0]) {
      let temporaryResource = [];
      let observables = [];
      this.loading = true;

      attachments.forEach(attachment => {
        if (!(attachment instanceof File) && !attachment.loaded) {
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

      forkJoin(observables).subscribe(
        (response) => {
          this.resources.push(...temporaryResource);
          this.onNativeChange(attachments);
          this.onFilePreviewLoaded.emit();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        });
    }
  }

  downloadFile(attachment: any) {
    this.ngtAttachmentHttpService.download(attachment).subscribe(() => { });
  }

  onRemove(resource: any) {
    this.resources.splice(this.resources.indexOf(resource), 1);
    this.nativeValue = this.nativeValue.filter(element => element.id != resource.id);
    this.onNativeChange(this.nativeValue);
    this.onFileRemoved.emit(resource);
  }

  onNativeChange(value: any) {
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

  private initComponent() {
    if (this.formContainer && this.formContainer.control
      && (this.formControl = this.formContainer.control.get(this.name))) {
      this.updateValidations();

      if (this.value) {
        this.formControl.markAsDirty();
      } else {
        this.formControl.markAsPristine();
      }
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

    syncValidators.push()

    setTimeout(() => {
      this.formControl.setValidators(syncValidators);
      this.formControl.updateValueAndValidity();
    });
  }

  change(value: any) {
    if (value) {
      this.onNativeChange(Array.isArray(value) ? value : [value]);
      this.loadFilePreview(Array.isArray(value) ? value : [value]);
    }
  }

  public openFileSelector() {
    if (this.ngxDropzone) {
      this.ngxDropzone.showFileSelector();
    }
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