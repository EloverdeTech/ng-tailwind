import { NgtHttpFormService } from 'projects/ng-tailwind/src/public-api';
import { Observable, Observer } from 'rxjs';

export class NgtHttpFormTestService extends NgtHttpFormService {
    public loadResourceById(resource: any, resourceId: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(alert('Resource loaded!'));
            observer.complete();
        });
    }

    public saveResource(resource: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(alert('Resource saved!'));
            observer.complete();
        });
    }
}
