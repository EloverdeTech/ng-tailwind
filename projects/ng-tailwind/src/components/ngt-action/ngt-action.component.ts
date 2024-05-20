import {
    Component,
    Injector,
    Input,
    OnDestroy,
    Optional,
    Self,
    SkipSelf,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';
import { NgtModalBodyComponent } from '../ngt-modal/ngt-modal-body/ngt-modal-body.component';

@Component({
    selector: 'ngt-action',
    templateUrl: './ngt-action.component.html'
})
export class NgtActionComponent implements OnDestroy {
    @Input() public href: string;
    @Input() public icon: string;
    @Input() public ngtStyle: NgtStylizableService;
    @Input() public isDisabled: boolean;
    @Input() public forceEnable: boolean;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        public ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        public ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        public ngtModal: NgtModalComponent,

        @Optional() @SkipSelf()
        public ngtModalBody: NgtModalBodyComponent
    ) {
        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtAction', {
            h: 'h-full',
            w: 'w-full',
            color: {
                bg: 'bg-gray-500',
                text: 'text-white',
                border: '',
            },
            text: 'text-sm',
            border: 'border-0',
        });
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public onClick(event: Event) {
        if (this.disabled()) {
            event.stopPropagation();
        }
    }

    public disabled(): boolean {
        return !this.forceEnable && (this.isDisabled || this.isDisabledByParent());
    }

    private isDisabledByParent(): boolean {
        return this.ngtForm?.isDisabled
            || this.ngtSection?.isDisabled
            || this.ngtModal?.isDisabled;
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
