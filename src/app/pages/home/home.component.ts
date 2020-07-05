import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { sidenavMenuMetadata } from '../../resources/meta/sidenav-menu.meta';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public sidenavMenuMetadata = sidenavMenuMetadata;
    public activeUrl: string;
    public searchValue: string;

    public constructor(private router: Router) {
        router.events.subscribe(() => {
            this.bindActiveUrl();
        });
    }

    private bindActiveUrl() {
        this.activeUrl = '';

        for (let i = 0; i < this.sidenavMenuMetadata.length; i++) {
            let found = false;

            for (let j = 0; j < this.sidenavMenuMetadata[i].menus.length; j++) {
                const menuUrl = this.sidenavMenuMetadata[i].menus[j].url;

                if (this.router.isActive((menuUrl), false)) {
                    this.activeUrl = menuUrl;
                    found = true;
                    break;
                }
            }

            if (found) {
                break;
            }
        }
    }
}
