import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Host,
    Injector,
    Input,
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
export class NgtCheckboxComponent extends NgtBaseNgModel implements AfterViewInit, OnDestroy {
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

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private injector: Injector,
        @Optional() @Host()
        public formContainer: ControlContainer,
        private renderer: Renderer2,
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent,
    ) {
        super();

        if (this.ngtFormComponent) {
            this.shining = this.ngtFormComponent.isShining();

            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }

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

    public ngAfterViewInit() {
        this.renderer.listen(this.element.nativeElement, 'change', (value) => {
            this.onNativeChange(this.element.nativeElement.checked);
        });
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

    public isDefaultMode() {
        return this.mode === NgtCheckboxMode.DEFAULT;
    }

    public isRadioMode() {
        return this.mode === NgtCheckboxMode.RADIO;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.mode) {
            this.mode = getEnumFromString(changes.mode.currentValue, NgtCheckboxMode);
        }
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}

export enum NgtCheckboxMode {
    DEFAULT = 'DEFAULT',
    TOGGLE = 'TOGGLE',
    RADIO = 'RADIO',
}
