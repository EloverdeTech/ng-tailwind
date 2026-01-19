import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    NgZone,
    Optional,
    Self,
    ViewChild,
    input,
    signal,
    WritableSignal,
    effect,
} from '@angular/core';

import { fadeDownAnimation } from '../../animations/ngt-angular-animations';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { Size } from '../../enums/size.enum';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-sidenav',
    templateUrl: './ngt-sidenav.component.html',
    animations: [
        fadeDownAnimation('fadeDownAnimation', 600)
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class NgtSidenavComponent implements AfterViewInit {
    @ViewChild('sideMenu', { static: true }) public sideMenuRef: ElementRef;
    @ViewChild('container', { static: true }) public containerRef: ElementRef;

    /** Inputs */

    public readonly size = input<Size>(Size.XS);
    public readonly initVisible = input<boolean>(false);
    public readonly closeMenuOnMobileView = input<boolean>(true);

    /** Signals */

    public readonly visible: WritableSignal<boolean> = signal(false);
    public readonly open: WritableSignal<boolean> = signal(false);
    public readonly isMenuContracted: WritableSignal<boolean> = signal(false);

    public ngtStyle: NgtStylizableService;

    private readonly screenWidth: WritableSignal<number> = signal(window.innerWidth);
    private readonly sizeState: WritableSignal<Size> = signal(Size.XS);
    private resizeListener: () => void;

    public constructor(
        private injector: Injector,
        private zone: NgZone,
        @Self() @Optional() private ngtStyleDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
        this.bindScreenSize();

        effect(() => {
            this.sizeState.set(this.normalizeInputSize());
        });
    }

    public bindScreenSize(): void {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = () => this.screenWidth.set(window.innerWidth);
            window.addEventListener('resize', this.resizeListener);
        });
    }

    public ngAfterViewInit() {
        if (this.initVisible()) {
            setTimeout(() => {
                this.visible.set(true);
            });
        }
    }

    public toggleMenu() {
        if (this.open()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    public closeMenu() {
        this.open.set(false);
    }

    public openMenu() {
        this.open.set(true);
    }

    public getNavSize() {
        switch (this.normalizeSize()) {
            case Size.AUTO: return 'md:w-auto w-4/12';
            case Size.XS: return 'md:w-1/12 w-4/12';
            case Size.SM: return 'md:w-2/12 w-5/12';
            case Size.MD: return 'md:w-4/12 w-6/12';
            case Size.XL: return 'md:w-6/12 w-full';
            case Size.FULL: return 'w-full';
        }
    }

    public getContainerSize() {
        if (!this.visible()) {
            return 'w-full';
        }

        if (this.isMobileView()) {
            return 'w-full';
        }

        switch (this.normalizeSize()) {
            case Size.AUTO: return 'w-full';
            case Size.XS: return 'md:w-11/12 w-full';
            case Size.SM: return 'md:w-10/12 w-full';
            case Size.MD: return 'md:w-8/12 w-full';
            case Size.XL: return 'md:w-6/12 w-full';
            case Size.FULL: return 'w-full';
        }
    }

    public toggleMenuSize(size: Size) {
        if (this.isMenuContracted()) {
            this.sizeState.set(size);
            this.isMenuContracted.set(false);
        } else {
            this.sizeState.set(Size.AUTO);
            this.isMenuContracted.set(true);
        }
    }

    public isMobileView() {
        if (!this.closeMenuOnMobileView()) {
            return false;
        }

        return this.screenWidth() < 1024;
    }

    private normalizeSize(): Size {
        return this.sizeState();
    }

    private normalizeInputSize(): Size {
        return typeof this.size() === 'string'
            ? getEnumFromString(this.size(), Size)
            : this.size();
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStyleDirective
            ? this.ngtStyleDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'Sidenav', {
            h: 'md:h-auto h-screen',
            color: {}
        });
    }
}
