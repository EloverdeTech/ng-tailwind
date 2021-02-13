import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxViewerModule } from 'ngx-viewer';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtSvgModule } from '../ngt-svg/ngt-svg.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtDropzoneFileViewerComponent } from './ngt-dropzone-file-viewer/ngt-dropzone-file-viewer.component';
import { NgtDropzoneViewComponent } from './ngt-dropzone-view/ngt-dropzone-view.component';
import { NgtDropzoneComponent } from './ngt-dropzone.component';

@NgModule({
    declarations: [NgtDropzoneComponent, NgtDropzoneFileViewerComponent, NgtDropzoneViewComponent],
    exports: [NgtDropzoneComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgxDropzoneModule,
        NgxViewerModule,
        NgtSvgModule,
        NgxDocViewerModule
    ]
})
export class NgtDropzoneModule { }
