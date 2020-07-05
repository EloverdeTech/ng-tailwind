import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Host,
    Injector,
    Input,
    Optional,
    Renderer2,
    Self,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';

@Component({
    selector: 'ngt-checkbox',
    templateUrl: './ngt-checkbox.component.html',
    styleUrls: ['./ngt-checkbox.component.css'],
    providers: [
        NgtMakeProvider(NgtCheckboxComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ],
    animations: [
        trigger('slideLeftToRight', [
            state('void', style({ transform: 'translateX(-4px) rotate(45deg)', opacity: 0 })),
            transition(':enter', [
                animate(200)
            ])
        ]),

        trigger('slideRightToLeft', [
            state('void', style({ transform: 'translateX(4px) rotate(45deg)', opacity: 0 })),
            transition(':enter', [
                animate(200)
            ])
        ]),
    ]
})
export class NgtCheckboxComponent extends NgtBaseNgModel implements AfterViewInit {
    @ViewChild('element', { static: true }) public element: ElementRef;

    @Input() public label: string;
    @Input() public name: string;
    @Input() public mode: NgtCheckboxMode = NgtCheckboxMode.DEFAULT;

    public ngtStyle: NgtStylizableService;

    public constructor(
        private injector: Injector,
        @Optional() @Host()
        public formContainer: ControlContainer,
        private renderer: Renderer2,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective
    ) {
        super();

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtCheckbox', {
            color: {
                bg: 'bg-gray-500'
            }
        });
    }

    public change(value) {
        if (this.hasChangesBetweenModels()) {
            this.element.nativeElement.checked = value;
        }
    }

    public onNativeChange(value) {
        if (this.hasChangesBetweenModels()) {
            this.value = value;
        }
    }

    public hasChangesBetweenModels() {
        return this.element.nativeElement.checked !== this.value;
    }

    public ngAfterViewInit() {
        this.renderer.listen(this.element.nativeElement, 'change', (value) => {
            this.onNativeChange(this.element.nativeElement.checked);
        });
    }

    public isToggleMode() {
        return this.mode == NgtCheckboxMode.TOGGLE;
    }

    public isDefaultMode() {
        return this.mode == NgtCheckboxMode.DEFAULT;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.mode) {
            this.mode = getEnumFromString(changes.mode.currentValue, NgtCheckboxMode);
        }
    }
}

export enum NgtCheckboxMode {
    DEFAULT = 'DEFAULT',
    TOGGLE = 'TOGGLE'
}
