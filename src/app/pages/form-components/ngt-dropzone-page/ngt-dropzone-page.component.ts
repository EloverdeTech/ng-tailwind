import { Component, OnInit } from '@angular/core';
import { NgtDropzoneErrorType, NgtDropzonePreviewType } from 'projects/ng-tailwind/src/public-api';

@Component({
    selector: 'app-ngt-dropzone-page',
    templateUrl: './ngt-dropzone-page.component.html'
})
export class NgtDropzonePageComponent implements OnInit {
    public ngtDropzonePreviewTypeOne = NgtDropzonePreviewType.IMAGE;
    public ngtDropzonePreviewTypeTwo = NgtDropzonePreviewType.DEFAULT;
    public ngtDropzoneAcceptedFiles = `image/jpeg, image/png, image/webp, image/tiff, image/bmp`;

    public ngModelOne: any;
    public ngModelTwo: any;

    public codeExample = `
  <ngt-dropzone name='ngtDropzoneOne' [(ngModel)]="ngModelOne" itemsLimit='1' 
    [removable]='true' [previewType]='ngtDropzonePreviewTypeOne' 
    [acceptedFiles]='ngtDropzoneAcceptedFiles' label='Select or drop a photo' 
    (onFileSelectError)='onFileSelectError($event)'>
  </ngt-dropzone>

  <ngt-dropzone name='ngtDropzoneTwo' [(ngModel)]="ngModelTwo" itemsLimit='3' 
    [removable]='true' [previewType]='ngtDropzonePreviewTypeTwo' 
    label='Select or drop a photo' [maxFileSize]='10000000' 
    (onFileSelectError)='onFileSelectError($event)'>
  </ngt-dropzone>
  `;

    public constructor() { }

    public ngOnInit() { }

    public onFileSelectError(errorType: NgtDropzoneErrorType) {
        switch (errorType) {
            case NgtDropzoneErrorType.SIZE:
                alert('Maximum size exceeded');
                break;
            case NgtDropzoneErrorType.NO_MULTIPLE:
                alert('Only one file must be selected at a time');
                break;
            case NgtDropzoneErrorType.ITEMS_LIMIT:
                alert('Item limit exceeded');
                break;
            case NgtDropzoneErrorType.TYPE:
                alert('File type not allowed');
                break;
        }
    }
}
