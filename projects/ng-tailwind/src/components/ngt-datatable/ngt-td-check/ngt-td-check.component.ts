import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    Optional,
    OutputRefSubscription,
    Self,
    SkipSelf,
    ViewChild,
    effect,
    input,
    output,
    signal,
    WritableSignal,
    Input,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NgtStylizableDirective } from '../../../directives/ngt-stylizable/ngt-stylizable.directive';
import { uuid } from '../../../helpers/uuid';
import { NgtStylizableService } from '../../../services/ngt-stylizable/ngt-stylizable.service';
import { NgtCheckboxComponent } from '../../forms/template-driven/ngt-checkbox/ngt-checkbox.component';
import { NgtDatatableComponent } from '../ngt-datatable.component';

@Component({
    selector: '[ngt-td-check]',
    templateUrl: './ngt-td-check.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtTdCheckComponent implements AfterContentInit, OnDestroy {
    @ViewChild(NgtCheckboxComponent, { static: true }) public checkbox: NgtCheckboxComponent;

    /** Inputs */

    public readonly reference = input<any>();
    public readonly isDisabled = input<boolean>(false);
    // public readonly checked = input<boolean>(false);

    @Input() public checked: boolean = false;

    /** Outputs */

    public readonly onCheckboxInit = output<any>();

    /** Signals */

    public ngtStyle: NgtStylizableService;

    private readonly referenceState: WritableSignal<any> = signal(null);
    private readonly isDisabledState: WritableSignal<boolean> = signal(false);
    private readonly checkedState: WritableSignal<boolean> = signal(false);

    private id: string = uuid();
    private subscriptions: Array<Subscription | OutputRefSubscription> = [];
    private isFirstChange: boolean = true;

    public constructor(
        private injector: Injector,
        private hostElement: ElementRef,
        @Self() @Optional() private ngtStylizableDirective: NgtStylizableDirective,
        @Optional() @SkipSelf()
        private ngtDataTable: NgtDatatableComponent
    ) {
        this.setupNgtStylizable();

        effect(() => {
            this.referenceState.set(this.reference());
        });

        effect(() => {
            this.isDisabledState.set(!!this.isDisabled());
        });

        effect(() => {
            this.checkedState.set(!!this.checked);
        });
    }

    public ngAfterContentInit(): void {
        if (this.ngtDataTable) {
            this.subscriptions.push(
                this.ngtDataTable.onToogleAllCheckboxes.subscribe((checked: boolean) => {
                    this.checkedState.set(checked);
                })
            );

            this.subscriptions.push(
                this.ngtDataTable.onClearSelectedElements.subscribe(() => {
                    this.checkedState.set(false);
                })
            );

            this.onCheckboxInit.emit({
                id: this.id,
                checked: this.checkedState(),
                reference: this.referenceState()
            });
        }
    }

    public onCheckboxChange(checked: boolean): void {
        this.checkedState.set(checked);

        if (this.ngtDataTable && !this.isFirstChange) {
            this.ngtDataTable.onToogleCheckbox.emit({
                id: this.id,
                checked: checked,
                reference: this.referenceState()
            });
        }

        this.isFirstChange = false;
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    private setupNgtStylizable(): void {
        this.ngtStyle = this.ngtStylizableDirective
            ? this.ngtStylizableDirective.getNgtStylizableService()
            : new NgtStylizableService();

        this.ngtStyle.load(this.injector, 'NgtTdCheck', {
            py: 'py-4',
            px: 'px-6',
            text: 'text-center',
            border: 'border-b',
            color: {
                border: ''
            }
        });

        this.hostElement.nativeElement.classList += this.ngtStyle.compile([
            'h',
            'px',
            'py',
            'pb',
            'pl',
            'pr',
            'pt',
            'mb',
            'ml',
            'mr',
            'mt',
            'border',
            'color.border',
        ]);
    }
}
