import {Component, Input} from '@angular/core';

@Component({
    selector: 'ngt-modal-body',
    templateUrl: './ngt-modal-body.component.html'
})
export class NgtModalBodyComponent {
    @Input() public spaceChange: false;
}
