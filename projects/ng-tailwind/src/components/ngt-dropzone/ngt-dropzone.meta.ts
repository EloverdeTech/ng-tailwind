export interface NgtDropzoneFile {
    downloadUrl: string;
    previewUrl: string;
    thumbnailUrl: string;
    name: string;
    mimeType: string;
    fileSize: any;
};

export enum NgtDropzoneFileTypeEnum {
    DOC = 'DOC',
    PDF = 'PDF',
    XLS = 'XLS',
    DWG = 'DWG',
    OTHER = 'OTHER'
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
