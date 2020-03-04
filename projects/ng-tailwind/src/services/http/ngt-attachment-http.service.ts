import { Observable } from 'rxjs';

export abstract class NgtAttachmentHttpService {
    abstract preview(attachment: any): Observable<NgtAttachmentHttpResponse>;

    abstract download(attachment: any): Observable<any>;

    abstract upload(remoteResource: any, file: any): Observable<any>;
}

export interface NgtAttachmentHttpResponse {
    data?: any;
}