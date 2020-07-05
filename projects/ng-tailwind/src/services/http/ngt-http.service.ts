import { Observable } from 'rxjs';

export abstract class NgtHttpService {
    abstract get(connector: any, filters: any, pagination: NgtHttpPagination, sort?: NgtHttpSort): Observable<NgtHttpResponse>;

    abstract post(data: any): Observable<any>;

    abstract put(data: any): Observable<any>;

    abstract delete(data: any): Observable<any>;
}

export interface NgtHttpResponse {
    data?: any;
    meta: NgtHttpMeta;
}

export interface NgtHttpMeta {
    pagination: NgtHttpPagination;
}

export interface NgtHttpPagination {
    count: number;
    page: number;
    pages: number;
    total: number;
    from: number;
    to: number;
    per_page: number;
}

export interface NgtHttpSort {
    field: string;
    direction: string;
}
