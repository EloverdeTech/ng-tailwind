import { Observable } from 'rxjs';

export abstract class NgtHttpFormService {
    public abstract loadResourceById(resource: any, resourceId: any): Observable<any>;

    public abstract saveResource(resource: any): Observable<any>;
}
