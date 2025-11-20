import { Injectable } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { NgtDropzoneErrorType } from '../../../../../meta/ngt-dropzone.meta';

export interface ErrorValidationResult {
    hasError: boolean;
    errorType?: NgtDropzoneErrorType;
}

@Injectable()
export class NgtReactiveDropzoneErrorService {
    public validateRejectedFiles(event: NgxDropzoneChangeEvent): ErrorValidationResult {
        if (!event.rejectedFiles.length) {
            return { hasError: false };
        }

        for (const rejectedFile of event.rejectedFiles as any) {
            if (rejectedFile.reason === 'size') {
                return { hasError: true, errorType: NgtDropzoneErrorType.SIZE };
            }

            if (rejectedFile.reason === 'no_multiple') {
                return { hasError: true, errorType: NgtDropzoneErrorType.NO_MULTIPLE };
            }

            if (rejectedFile.reason === 'type') {
                return { hasError: true, errorType: NgtDropzoneErrorType.TYPE };
            }
        }

        return { hasError: true, errorType: NgtDropzoneErrorType.DEFAULT };
    }

    public validateItemsLimit(
        addedFilesCount: number,
        currentFilesCount: number,
        itemsLimit: number
    ): ErrorValidationResult {
        if ((addedFilesCount + currentFilesCount) > itemsLimit) {
            return { hasError: true, errorType: NgtDropzoneErrorType.ITEMS_LIMIT };
        }

        return { hasError: false };
    }

    public shouldClearExistingResources(
        itemsLimit: number,
        addedFilesCount: number,
        currentFilesCount: number
    ): boolean {
        return itemsLimit === 1
            && addedFilesCount === itemsLimit
            && currentFilesCount === itemsLimit;
    }
}
