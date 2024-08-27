import { AfterViewInit, ChangeDetectorRef, Component, Injector, Input, Optional, Self } from '@angular/core';
import { NgtAbilityValidationService } from '../../../services/validation/ngt-ability-validation.service';
import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-modal-body',
    templateUrl: './ngt-modal-body.component.html'
})
export class NgtModalBodyComponent implements AfterViewInit {
    @Input() public ngtStyle: NgtStylizableService;
    @Input() public isDisabled: boolean;

    public constructor(
        private injector: Injector,
        private changeDetector: ChangeDetectorRef,

        @Self() @Optional()
        private tailStylizableDirective: NgtStylizableDirective,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
    ) {
        if (this.tailStylizableDirective) {
            this.ngtStyle = this.tailStylizableDirective.getNgtStylizableService();
        } else if (!this.ngtStyle) {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtModalBody', {
            px: 'px-0',
            py: 'py-0'
        });
    }

    public async ngAfterViewInit(): Promise<void> {
        if (this.isDisabled === undefined && this.ngtAbilityValidationService) {
            this.isDisabled = !(await this.ngtAbilityValidationService.hasManagePermission());

            this.changeDetector.detectChanges();
        }
    }
}
