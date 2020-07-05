import {
    Component,
    ElementRef,
    HostBinding,
    Injector,
    Input,
    Optional,
    Self,
    SkipSelf,
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
    encapsulation: ViewEncapsulation.None
})
export class NgtTrComponent {
    @HostBinding('class.evenStripped') @Input() public evenStripped: boolean;
    @HostBinding('class.oddStripped') @Input() public oddStripped: boolean;

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @SkipSelf() @Optional() private ngtThead: NgtTheadComponent,
        @SkipSelf() @Optional() private ngtTbody: NgtTbodyComponent,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

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
