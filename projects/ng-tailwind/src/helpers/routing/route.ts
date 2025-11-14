import { ActivatedRoute } from '@angular/router';
import { Observable, Observer, zip } from 'rxjs';

export function getIdFromUri(route: ActivatedRoute, routeIdentifier: string) {
    return new Observable((observer: Observer<any>) => {
        zip(route.parent.params, route.params)
            .subscribe((results) => {
                let params = { ...results[0], ...results[1] };

                observer.next(params[routeIdentifier]);
                observer.complete();
            });
    });
}
