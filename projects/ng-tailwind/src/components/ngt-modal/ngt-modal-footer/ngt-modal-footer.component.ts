import {Component, Input} from '@angular/core';

@Component({
    selector: 'ngt-modal-footer',
    templateUrl: './ngt-modal-footer.component.html'
})
export class NgtModalFooterComponent {
    @Input() public spaceChange: false;
}
