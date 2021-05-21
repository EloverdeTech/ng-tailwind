import { NgtHttpPagination, NgtHttpResponse, NgtHttpService } from 'projects/ng-tailwind/src/services/http/ngt-http.service';
import { Observable, Observer } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class NgtHttpTest extends NgtHttpService {
    public get(connector: any, filters: any, pagination: NgtHttpPagination): Observable<NgtHttpResponse> {
        return Observable.create((observer: Observer<NgtHttpResponse>) => {
            observer.next({
                data: [
                    {
                        name: 'Foo'
                    },
                    {
                        name: 'Bar'
                    },
                ],
                meta: {
                    pagination: {
                        count: 2,
                        page: pagination.page,
                        pages: 100,
                        total: 2,
                        from: 1,
                        to: 2,
                        per_page: pagination.per_page ? pagination.per_page : 15,
                    }
                }
            });
        });
    }

    public post(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }

    public put(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }

    public delete(data: any): Observable<any> {
        throw new Error("Method not implemented.");
    }
}
