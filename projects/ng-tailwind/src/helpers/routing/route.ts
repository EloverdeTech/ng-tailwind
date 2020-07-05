import { ActivatedRoute } from '@angular/router';
import { Observable, zip } from 'rxjs';

export function getIdFromUri(route: ActivatedRoute, routeIdentifier: string) {
    return Observable.create((observer) => {
        zip(route.parent.params, route.params)
            .subscribe((results) => {
                let params = { ...results[0], ...results[1] };

                observer.next(params[routeIdentifier]);
            });
    });
}
