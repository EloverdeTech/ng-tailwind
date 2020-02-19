import { NgtHttpPagination, NgtHttpResponse } from 'ng-tailwind/services/http/ngt-http.service';
import { NgtHttpService } from 'projects/ng-tailwind/src/services/http/ngt-http.service';
import { Observable, Observer } from 'rxjs';

export class NgtHttpTest extends NgtHttpService {
    get(connector: any, filters: any, pagination: NgtHttpPagination): Observable<NgtHttpResponse> {
        return Observable.create((observer: Observer<NgtHttpResponse>) => {
            observer.next({
                data: [
                    {
                        name: 'Foo'
                    },
                    {
                        name: 'Bar'
                    }
                ],
                meta: {
                    pagination: {
                        count: 2,
                        page: pagination.page,
                        pages: 100,
                        total: 2,
                        from: 1,
                        to: 2,
                        per_page: 15,
                    }
                }
            });
        });
    }

    post(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }

    put(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }

    delete(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }
}