import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { NgtShiningModule } from '../ngt-shining/ngt-shining.module';
import { NgtValidationModule } from '../ngt-validation/ngt-validation.module';
import { NgtDropzoneComponent } from './ngt-dropzone.component';

@NgModule({
    declarations: [NgtDropzoneComponent],
    exports: [NgtDropzoneComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgtValidationModule,
        NgtShiningModule,
        NgxDropzoneModule
    ]
})
export class NgtDropzoneModule { }
