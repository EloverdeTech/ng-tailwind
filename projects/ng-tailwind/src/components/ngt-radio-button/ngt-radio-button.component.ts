import {
    AfterViewInit,
    ChangeDetectorRef,
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
import { NgtStylizableService } from '../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';
import { NgtSectionComponent } from '../ngt-section/ngt-section.component';
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
export class NgtRadioButtonComponent extends NgtBaseNgModel implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('element', { static: true }) public element: ElementRef;

    @Input() public label: string;
    @Input() public name: string;
    @Input() public shining: boolean;
    @Input() public isSelectable: boolean = true;
    @Input() public isDisabled: boolean;

    @Input() public helpTitle: string;
    @Input() public helpTextColor: string = 'text-green-500';
    @Input() public helpText: string;

    public ngtStyle: NgtStylizableService;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        private changeDetector: ChangeDetectorRef,
        private injector: Injector,
        @Optional() @Host()
        public formContainer: ControlContainer,
        private renderer: Renderer2,
        @Self() @Optional()
        private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        private ngtForm: NgtFormComponent,
        @Optional() @SkipSelf()
        public ngtSection: NgtSectionComponent,
        @Optional() @SkipSelf()
        private ngtRadioButtonContainer: NgtRadioButtonContainerComponent
    ) {
        super();

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

        this.bindSubscriptions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isDisabled && !changes.isDisabled.currentValue) {
            this.isDisabled = this.ngtForm?.isDisabled || this.ngtSection?.isDisabled;
        }
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

    private bindSubscriptions(): void {
        this.changeDetector.detectChanges();

        if (!this.isDisabled) {
            this.isDisabled = this.ngtForm?.isDisabled || this.ngtSection?.isDisabled;
        }

        if (this.ngtForm) {
            this.subscriptions.push(
                this.ngtForm.onIsDisabledChange.subscribe((isDisabled: boolean) => {
                    if (!this.isDisabled) {
                        this.isDisabled = isDisabled || this.ngtSection?.isDisabled;
                    }
                })
            );
        }

        if (this.ngtSection) {
            this.subscriptions.push(
                this.ngtSection.onIsDisabledChange.subscribe((isDisabled: boolean) => {
                    if (!this.isDisabled) {
                        this.isDisabled = isDisabled || this.ngtForm?.isDisabled;
                    }
                })
            );
        }

        this.changeDetector.detectChanges();
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
