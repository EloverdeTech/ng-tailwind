import { NgtHttpFormService } from 'projects/ng-tailwind/src/public-api';
import { Observable, Observer } from 'rxjs';

export class NgtHttpFormTestService extends NgtHttpFormService {
    loadResourceById(resource: any, resourceId: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(alert('Resource loaded!'));
            observer.complete();
        });
    }
    saveResource(resource: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(alert('Resource saved!'));
            observer.complete();
        });
    }
}