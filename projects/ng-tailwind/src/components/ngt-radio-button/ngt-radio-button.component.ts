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
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { NgtStylizableDirective } from '../../directives/ngt-stylizable/ngt-stylizable.directive';
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtRadioButtonContainerComponent } from './ngt-radio-button-container/ngt-radio-button-container.component';

@Component({
    selector: 'ngt-radio-button',
    templateUrl: './ngt-radio-button.component.html',
    styleUrls: ['./ngt-radio-button.component.css'],
    providers: [
        NgtMakeProvider(NgtRadioButtonComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtRadioButtonComponent extends NgtBaseNgModel implements AfterViewInit, OnDestroy {
    @ViewChild('element', { static: true }) public element: ElementRef;

    @Input() public label: string;
    @Input() public name: string;
    @Input() public shining: boolean;
    @Input() public isSelectable: boolean = true;
    @Input() public isDisabled: boolean;

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
        @Optional() @SkipSelf()
        private ngtRadioButtonContainer: NgtRadioButtonContainerComponent
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

        if (this.ngtRadioButtonContainer) {
            this.subscriptions.push(
                this.ngtRadioButtonContainer.onActiveRadioButtonChange.subscribe((activeRadioButton: NgtRadioButtonComponent) => {
                    this.value = (activeRadioButton.name === this.name);
                })
            );
        }

        if (this.ngtStylizableDirective) {
            this.ngtStyle = this.ngtStylizableDirective.getNgtStylizableService();
        } else {
            this.ngtStyle = new NgtStylizableService();
        }

        this.ngtStyle.load(this.injector, 'NgtCheckbox', {
            color: {
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

    public change(value: boolean) {
        if (value) {
            this.element.nativeElement.checked = value;

            if (this.ngtRadioButtonContainer) {
                this.ngtRadioButtonContainer.setActiveRadioButton(this);
            }
        }
    }

    public onNativeChange(value: boolean) {
        this.value = value ? value : !value;

        if (this.ngtRadioButtonContainer) {
            this.ngtRadioButtonContainer.setActiveRadioButton(this);
        }
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
