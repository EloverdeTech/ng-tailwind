import { uuid } from 'projects/ng-tailwind/src/helpers/uuid';
import { NgtAttachmentHttpResponse, NgtAttachmentHttpService } from 'projects/ng-tailwind/src/public-api';
import { Observable } from 'rxjs';

export class NgtAttachmentHttpServiceTest extends NgtAttachmentHttpService {
    preview(attachment: any): Observable<NgtAttachmentHttpResponse> {
        return Observable.create((observer: any) => {
            console.log('Attachment Preview');
            observer.complete();
        });
    }

    download(attachment: any): Observable<any> {
        return Observable.create((observer: any) => {
            console.log('Attachment Download');
            observer.complete();
        });
    }

    upload(remoteResource: any, file: any): Observable<any> {
        return Observable.create((observer: any) => {
            observer.next({
                data: {
                    id: uuid()
                }
            });

            observer.complete();
        });
    }
}