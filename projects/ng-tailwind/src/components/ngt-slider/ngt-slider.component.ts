import {
    AfterViewInit,
    Component,
    ElementRef,
    Host,
    Input,
    OnDestroy,
    Optional,
    Renderer2,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgtBaseNgModel, NgtMakeProvider } from '../../base/ngt-base-ng-model';
import { Color } from '../../enums/color.enum';
import { NgtFormComponent } from '../ngt-form/ngt-form.component';

@Component({
    selector: 'ngt-slider',
    templateUrl: './ngt-slider.component.html',
    styleUrls: ['./ngt-slider.component.css'],
    providers: [
        NgtMakeProvider(NgtSliderComponent),
    ],
    viewProviders: [
        { provide: ControlContainer, useExisting: NgForm }
    ]
})
export class NgtSliderComponent extends NgtBaseNgModel implements AfterViewInit, OnDestroy {
    @ViewChild('element', { static: true }) public element: ElementRef;
    @ViewChild('display', { static: true }) public display: ElementRef;

    @Input() public label: string;
    @Input() public shining: boolean;
    @Input() public name: string;
    @Input() public min: string = '0';
    @Input() public max: string = '100';
    @Input() public step: string = '1';
    @Input() public color: Color = Color.primary;

    private subscriptions: Array<Subscription> = [];

    public constructor(
        @Optional() @Host()
        public formContainer: ControlContainer,
        private renderer: Renderer2,
        @Optional() @SkipSelf()
        private ngtFormComponent: NgtFormComponent,
    ) {
        super();

        if (this.ngtFormComponent) {
            this.subscriptions.push(
                this.ngtFormComponent.onShiningChange.subscribe((shining: boolean) => {
                    this.shining = shining;
                })
            );
        }
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.display.nativeElement.innerHTML = this.value;
        }, 500);

        this.renderer.listen(this.element.nativeElement, 'change', () => {
            this.onNativeChange(this.element.nativeElement.value);
        });
    }

    public ngOnDestroy() {
        this.destroySubscriptions();
    }

    public change(value: boolean) {
        this.element.nativeElement.value = value;
    }

    public onNativeChange(value: boolean) {
        this.value = value;
    }

    private destroySubscriptions() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
