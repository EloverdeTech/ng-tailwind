import { Injectable } from '@angular/core';
import { DropdownPosition, NgSelectComponent } from '@ng-select/ng-select';
import { delay } from '../../../../../helpers/promise/promise-helper';
import { NgtSelectStateService } from './ngt-select-state.service';

@Injectable({ providedIn: null })
export class NgtSelectDropdownService {
    public constructor(
        private stateService: NgtSelectStateService,
    ) { }

    public async calculateDropdownPosition(
        ngSelectComponent: NgSelectComponent,
        parentContainer: Element,
    ): Promise<void> {
        while (this.stateService.loading()) {
            await delay(200);
        }

        setTimeout(() => {
            const ngSelectElement = ngSelectComponent.element;
            const ngSelectHeight = ngSelectElement.offsetHeight;
            const ngSelectYPosition = ngSelectElement.getBoundingClientRect().y;

            const dropdownHeight = ngSelectComponent.dropdownPanel.contentElementRef.nativeElement.offsetHeight;
            const openedSelectHeight = ngSelectHeight + dropdownHeight;

            const parentYPosition = parentContainer.getBoundingClientRect().y;
            const ngSelectYPositionInsideParent = ngSelectYPosition - parentYPosition;

            const openedSelectTotalHeight = openedSelectHeight + ngSelectYPositionInsideParent;
            const parentContainerHeight = parentContainer.clientHeight;

            const fitsOnTop = openedSelectHeight < ngSelectYPositionInsideParent;
            const fitsOnBottom = openedSelectTotalHeight < parentContainerHeight;

            const dropdownPosition: DropdownPosition = !fitsOnBottom && fitsOnTop
                ? 'top'
                : 'bottom';

            (<any>ngSelectComponent.dropdownPanel['_currentPosition']) = dropdownPosition;

            ngSelectComponent.dropdownPanel['_updateDropdownClass'](dropdownPosition);
        });
    }
}
