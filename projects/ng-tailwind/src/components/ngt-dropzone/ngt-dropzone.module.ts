import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxViewerModule } from 'ngx-viewer';

import { NgtHelperModule } from '../ngt-helper/ngt-helper.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { CustomDropzonePreviewComponent } from './custom-dropzone-preview/custom-dropzone-preview.component';
import { NgtDropzoneFileViewerComponent } from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneViewComponent } from './ngt-dropzone-view/ngt-dropzone-view.component';
import { NgtDropzoneComponent } from './ngt-dropzone.component';

@NgModule({
    exports: [NgtDropzoneComponent],
    declarations: [
        NgtDropzoneComponent,
        NgtDropzoneFileViewerComponent,
        NgtDropzoneViewComponent,
        CustomDropzonePreviewComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgxDropzoneModule,
        NgxViewerModule,
        NgtSvgModule,
        NgxDocViewerModule,
        NgtHelperModule,
    ]
})
export class NgtDropzoneModule { }
