import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { CustomDropzonePreviewComponent } from '../shared/custom-dropzone-preview/custom-dropzone-preview.component';
import { NgtDropzoneFileViewerComponent } from '../shared/ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneViewComponent } from '../shared/ngt-dropzone-view/ngt-dropzone-view.component';
import { NgtDropzoneComponent } from './ngt-dropzone.component';

@NgModule({
    exports: [NgtDropzoneComponent],
    declarations: [
        NgtDropzoneComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgxDropzoneModule,
        NgtSvgModule,
        NgtHelperModule,
        CustomDropzonePreviewComponent,
        NgtDropzoneFileViewerComponent,
        NgtDropzoneViewComponent,
    ]
})
export class NgtDropzoneModule { }
