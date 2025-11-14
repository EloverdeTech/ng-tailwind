import {
    ChangeDetectionStrategy,
    Component,
    computed,
    EventEmitter,
    input,
    OnDestroy,
    OnInit,
    Optional,
    output,
    signal,
    WritableSignal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { getIdFromUri } from '../../../../helpers/routing/route';
import { NgtHttpFormService } from '../../../../services/http/ngt-http-form.service';
import { NgtAbilityValidationService } from '../../../../services/validation/ngt-ability-validation.service';
import { NgtFormValidationMessageComponent } from '../../../ngt-form/ngt-form-validation-message/ngt-form-validation-message.component';

export enum NgtReactFormState {
    CREATING = 'CREATING',
    EDITING = 'EDITING'
}

@Component({
    selector: 'ngt-react-form',
    templateUrl: './ngt-react-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgtFormValidationMessageComponent,
    ]
})
export class NgtReactFormComponent implements OnInit, OnDestroy {
    public static onSubmitInvalidForm: EventEmitter<FormGroup> = new EventEmitter();

    /** Inputs */

    public readonly form = input.required<FormGroup>();
    public readonly resource = input.required<any>();
    public readonly guessFormState = input<boolean>(true);
    public readonly invalidFormMessage = input<string>('');
    public readonly routeIdentifier = input<string>('id');
    public readonly customLayout = input<boolean>(false);
    public readonly isDisabled = input<boolean>();

    /** Outputs */

    public readonly onCreating = output<void>();
    public readonly onEditing = output<any>();
    public readonly onResourceLoadingError = output<string>();

    /** Signals */

    public readonly formState: WritableSignal<NgtReactFormState> = signal(null);
    public readonly uriId: WritableSignal<any> = signal(null);
    public readonly loading: WritableSignal<boolean> = signal(false);
    public readonly shining: WritableSignal<boolean> = signal(false);
    public readonly canShowInvalidFormMessage: WritableSignal<boolean> = signal(false);
    public readonly isFormGroupDisabled: WritableSignal<boolean> = signal(false);

    public readonly isDisabledState = computed(() => this.isDisabled() || this.isFormGroupDisabled());

    private subscriptions: Array<Subscription> = [];
    private isSubmitted: boolean;

    public constructor(
        @Optional()
        private abilityValidationService: NgtAbilityValidationService,

        private httpFormService: NgtHttpFormService,
        private activatedRoute: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        if (this.guessFormState()) {
            this.determineFormState();
        }

        this.bindDisabledStateByAbilityValidation();

        this.subscriptions.push(
            this.subcribeFormGroupStatusChanges()
        );
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public onSubmit(): void {
        this.isSubmitted = true;

        this.canShowInvalidFormMessage.set(!this.form().valid);
    }

    public setFormState(state: NgtReactFormState, triggerChange: boolean = true): void {
        this.formState.set(state);

        if (triggerChange) {
            this.triggerFormStateChange();
        }
    }

    public isCreating(): boolean {
        return this.formState() === NgtReactFormState.CREATING;
    }

    public isEditing(): boolean {
        return this.formState() === NgtReactFormState.EDITING;
    }

    public isDirty(): boolean {
        return this.form()?.dirty;
    }

    private triggerFormStateChange(): void {
        if (this.isEditing()) {
            return this.triggerFormEditing();
        }

        if (this.isCreating()) {
            return this.triggerFormCreating();
        }
    }

    private triggerFormCreating(): void {
        this.onCreating.emit();
    }

    private triggerFormEditing(): void {
        const currentUriId = this.uriId();
        const currentResource = this.resource();

        if (currentUriId && currentResource) {
            this.loading.set(true);
            this.shining.set(true);

            this.httpFormService.loadResourceById(currentResource, currentUriId)
                .subscribe({
                    next: (resource: any) => {
                        this.onEditing.emit(resource);
                    },
                    error: (error) => {
                        this.onResourceLoadingError.emit(error);
                    },
                    complete: () => {
                        this.loading.set(false);
                        this.shining.set(false);
                    }
                });

            return;
        }

        this.onEditing.emit(null);
    }

    private determineFormState(): void {
        getIdFromUri(this.activatedRoute, this.routeIdentifier())
            .subscribe((id: string) => {
                this.uriId.set(id);

                this.setFormState(
                    this.uriId()
                        ? NgtReactFormState.EDITING
                        : NgtReactFormState.CREATING
                );
            });
    }

    private subcribeFormGroupStatusChanges(): Subscription {
        return this.form().statusChanges.subscribe(() => {
            if (!this.form().valid && this.isSubmitted) {
                NgtReactFormComponent.onSubmitInvalidForm.emit(this.form());

                this.canShowInvalidFormMessage.set(!this.isDisabledState());
            } else if (this.canShowInvalidFormMessage()) {
                this.canShowInvalidFormMessage.set(false);
            }
        });
    }

    private async bindDisabledStateByAbilityValidation(): Promise<void> {
        if (this.isDisabled() === undefined && this.abilityValidationService) {
            const hasPermission = await this.abilityValidationService.hasManagePermission();

            if (!hasPermission) {
                this.form().disable();

                this.isFormGroupDisabled.set(true);
            }
        }
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
