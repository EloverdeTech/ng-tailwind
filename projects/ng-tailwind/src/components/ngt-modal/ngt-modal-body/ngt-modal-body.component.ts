import { AfterViewInit, ChangeDetectorRef, Component, Input, Optional } from '@angular/core';
import { NgtAbilityValidationService } from '../../../services/validation/ngt-ability-validation.service';

@Component({
    selector: 'ngt-modal-body',
    templateUrl: './ngt-modal-body.component.html'
})
export class NgtModalBodyComponent implements AfterViewInit {
    @Input() public isDisabled: boolean;

    public constructor(
        private changeDetector: ChangeDetectorRef,

        @Optional()
        private ngtAbilityValidationService: NgtAbilityValidationService
    ) { }

    public async ngAfterViewInit(): Promise<void> {
        if (this.isDisabled === undefined && this.ngtAbilityValidationService) {
            this.isDisabled = !(await this.ngtAbilityValidationService.hasManagePermission());

            this.changeDetector.detectChanges();
        }
    }
}
