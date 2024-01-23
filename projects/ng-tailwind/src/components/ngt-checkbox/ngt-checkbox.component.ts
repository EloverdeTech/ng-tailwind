import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Host,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Renderer2,
    Self,
    SimpleChanges,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { getEnumFromString } from '../../helpers/enum/enum';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
import { NgtModalComponent } from '../ngt-modal/ngt-modal.component';

@Component({
    selector: 'ngt-checkbox',
    templateUrl: './ngt-checkbox.component.html',
    providers: [
        NgtMakeProvider(NgtCheckboxComponent)
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
        ])
    ]
})
export class NgtCheckboxComponent extends NgtBaseNgModel implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('element', { static: true }) public element: ElementRef;

    @Input() public label: string;
    @Input() public shining: boolean = false;
    @Input() public isDisabled: boolean = false;
    @Input() public isClickDisabled: boolean = false;
    @Input() public name: string;
    @Input() public mode: NgtCheckboxMode = NgtCheckboxMode.DEFAULT;
    @Input() public helpTitle: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helpText: string;
    @Input() public helperAutoXReverse: boolean = true;

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        private renderer: Renderer2,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,

        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,

        @Optional() @SkipSelf()
        private ngtSection: NgtSectionComponent,

        @Optional() @SkipSelf()
        private ngtModal: NgtModalComponent
    ) {
        super();

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtCheckbox', {
            h: 'h-6',
            w: 'w-6',
            text: 'text-sm',
            fontCase: '',
            color: {
                bg: 'bg-gray-500',
                text: 'text-gray-500',
                border: 'border-gray-500',
            }
        });
    }

    public ngAfterViewInit(): void {
        this.renderer.listen(this.element.nativeElement, 'change', (value) => {
            this.onNativeChange(this.element.nativeElement.checked);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode) {
            this.mode = getEnumFromString(changes.mode.currentValue, NgtCheckboxMode);
        }
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
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

    public isToggleMode() {
        return this.mode === NgtCheckboxMode.TOGGLE;
    }

    public isSideToggleMode(): boolean {
        return this.mode === NgtCheckboxMode.SIDE_TOGGLE;
    }

    public isDefaultMode() {
        return this.mode === NgtCheckboxMode.DEFAULT;
    }

    public isRadioMode() {
        return this.mode === NgtCheckboxMode.RADIO;
    }

    public disabled(): boolean {
        return this.isDisabled || this.isDisabledByParent();
    }

    private isDisabledByParent(): boolean {
        return this.ngtForm?.isDisabled
            || this.ngtSection?.isDisabled
            || this.ngtModal?.isDisabled;
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtCheckboxMode {
    DEFAULT = 'DEFAULT',
    TOGGLE = 'TOGGLE',
    SIDE_TOGGLE = 'SIDE_TOGGLE',
    RADIO = 'RADIO'
}
