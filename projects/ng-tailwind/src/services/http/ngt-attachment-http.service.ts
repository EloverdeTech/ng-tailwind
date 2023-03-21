import { Observable } from 'rxjs';

export abstract class NgtAttachmentHttpService {
    public abstract preview(attachment: any): Observable<NgtAttachmentHttpResponse>;

    public abstract thumbnail(attachment: any): Observable<NgtAttachmentHttpResponse>;

    public abstract download(attachment: any): Observable<any>;

    public abstract upload(remoteResource: any, file: any): Observable<any>;
}

export interface NgtAttachmentHttpResponse {
    data?: any;
}
