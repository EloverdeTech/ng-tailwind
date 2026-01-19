import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Injector,
    Optional,
    Self,
    SkipSelf,
    input,
    ViewEncapsulation,
} from '@angular/core';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtTbodyComponent } from '../ngt-tbody/ngt-tbody.component';
import { NgtTheadComponent } from '../ngt-thead/ngt-thead.component';

@Component({
    selector: '[ngt-tr]',
    templateUrl: './ngt-tr.component.html',
    styleUrls: ['./ngt-tr.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtTrComponent {
    public readonly evenStripped = input<boolean>(false);
    public readonly oddStripped = input<boolean>(false);

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @SkipSelf() @Optional() private ngtThead: NgtTheadComponent,
        @SkipSelf() @Optional() private ngtTbody: NgtTbodyComponent,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        this.setupNgtStylizable();
    }

    @HostBinding('class.evenStripped')
    public get evenStrippedClass(): boolean {
        return this.evenStripped();
    }

    @HostBinding('class.oddStripped')
    public get oddStrippedClass(): boolean {
        return this.oddStripped();
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtTr', {
            border: 'border-r border-t md:border-r-0 md:border-t-0',
            color: {
                bg: '',
                text: '',
                border: ''
            }
        }, [this.getInheritanceStyles()]);

        this.hostElement.nativeElement.classList += this.ngtStyle.compile([
            'h',
            'px',
            'py',
            'pb',
            'pl',
            'pr',
            'pt',
            'mb',
            'ml',
            'mr',
            'mt',
            'border',
            'color.bg',
            'color.text',
            'color.border',
            'text',
            'font',
        ]);
    }

    private getInheritanceStyles() {
        if (this.ngtThead) {
            return 'NgtTheadStyle';
        } else if (this.ngtTbody) {
            return 'NgtTbodyStyle';
        }

        return '';
    }
}
