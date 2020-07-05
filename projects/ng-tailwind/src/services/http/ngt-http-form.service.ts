import { Observable } from 'rxjs';

export abstract class NgtHttpFormService {
    abstract loadResourceById(resource: any, resourceId: any): Observable<any>;

    abstract saveResource(resource: any): Observable<any>;
}
