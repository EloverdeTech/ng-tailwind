import {
    ChangeDetectionStrategy,
    Component,
    computed,
    EventEmitter,
    Host,
    input,
    OnDestroy,
    OnInit,
    Optional,
    output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { isValidNgForm } from '../../../../helpers/form/form';
import { getIdFromUri } from '../../../../helpers/routing/route';
import { NgtHttpFormService } from '../../../../services/http/ngt-http-form.service';
import { NgtAbilityValidationService } from '../../../../services/validation/ngt-ability-validation.service';

export enum NgtFormState {
    CREATING = 'CREATING',
    EDITING = 'EDITING'
}

@Component({
    selector: 'ngt-form',
    templateUrl: './ngt-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NgtFormComponent implements OnInit, OnDestroy {
    public static onSubmitInvalidForm: EventEmitter<NgForm> = new EventEmitter();

    /** Inputs */

    public readonly guessFormState = input<boolean>(true);
    public readonly message = input<string>('');
    public readonly routeIdentifier = input<string>('id');
    public readonly resource = input<any>();
    public readonly customLayout = input<boolean>(false);
    public readonly isDisabled = input<boolean>();

    /** Outputs */

    public readonly onCreating = output<void>();
    public readonly onEditing = output<any>();
    public readonly onLoadingChange = output<boolean>();
    public readonly onShiningChange = output<boolean>();
    public readonly setupComponent = output<void>();
    public readonly onResourceLoadingError = output<string>();

    /** Signals */

    public readonly formState: WritableSignal<NgtFormState> = signal(null);
    public readonly uriId: WritableSignal<any> = signal(null);
    public readonly loading: WritableSignal<boolean> = signal(false);
    public readonly shining: WritableSignal<boolean> = signal(false);
    public readonly canShowInvalidFormMessage: WritableSignal<boolean> = signal(false);
    public readonly isDisabledByAbilityValidation: WritableSignal<boolean> = signal(false);

    public readonly isDisabledState = computed(() => this.isDisabled() || this.isDisabledByAbilityValidation());

    private subscriptions: Array<Subscription> = [];

    public constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,

        @Optional() @Host()
        public formContainer: ControlContainer,

        @Optional() @Host()
        public ngForm: NgForm,

        private httpFormService: NgtHttpFormService,

        @Optional()
        private abilityValidationService: NgtAbilityValidationService
    ) { }

    public ngOnInit(): void {
        if (this.guessFormState()) {
            this.determineFormState();
        }

        this.bindDisabledStateByAbilityValidation();

        this.subscriptions.push(
            this.ngForm.ngSubmit.subscribe(() => {
                if (!this.ngForm.valid) {
                    NgtFormComponent.onSubmitInvalidForm.emit(this.ngForm);

                    this.canShowInvalidFormMessage.set(!this.isDisabledState());
                }
            })
        );
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    public isCreating(): boolean {
        return this.formState() === NgtFormState.CREATING;
    }

    public isEditing(): boolean {
        return this.formState() === NgtFormState.EDITING;
    }

    public isLoading(): boolean {
        return this.loading();
    }

    public isShining(): boolean {
        return this.shining();
    }

    public canShowValidationMessage(): boolean {
        return this.canShowInvalidFormMessage() ||
            (this.formContainer &&
                this.formContainer['submitted'] &&
                this.formContainer.status !== 'VALID' &&
                this.formContainer.status !== 'DISABLED');
    }

    public setShining(shining: boolean): void {
        this.shining.set(shining);
        this.onShiningChange.emit(shining);
    }

    public setLoading(loading: boolean): void {
        this.loading.set(loading);
        this.onLoadingChange.emit(loading);
    }

    public setFormState(state: NgtFormState, triggerChange: boolean = true): void {
        this.formState.set(state);

        if (triggerChange) {
            this.triggerFormStateChange();
        }
    }

    public getFormState(): NgtFormState {
        return this.formState();
    }

    public triggerFormStateChange(): void {
        if (this.isEditing()) {
            this.triggerFormEditing();
        } else if (this.isCreating()) {
            this.triggerFormCreating();
        }
    }

    public formHasChanges(): boolean {
        return this.ngForm.dirty;
    }

    public saveResource(): Observable<any> {
        return new Observable((observer) => {
            if (isValidNgForm(this.ngForm)) {
                this.setLoading(true);

                this.subscriptions.push(
                    this.httpFormService.saveResource(this.resource())
                        .subscribe((response: any) => {
                            this.setLoading(false);
                            observer.next(response);
                            observer.complete();
                        })
                );
            } else {
                observer.error();
            }
        });
    }

    private triggerFormCreating(): void {
        this.onCreating.emit();
        this.setupComponent.emit();
    }

    private triggerFormEditing(): void {
        const currentUriId = this.uriId();
        const currentResource = this.resource();

        if (currentUriId && currentResource) {
            this.setLoading(true);
            this.setShining(true);

            this.httpFormService.loadResourceById(currentResource, currentUriId)
                .subscribe({
                    next: (resource: any) => {
                        this.setLoading(false);
                        this.setShining(false);

                        this.onEditing.emit(resource);

                        setTimeout(() => this.ngForm.form.markAsPristine(), 1500);

                        this.setupComponent.emit();
                    },
                    error: (error) => {
                        this.setLoading(false);
                        this.setShining(false);

                        this.onResourceLoadingError.emit(error);
                    }
                });

            return;
        }

        this.onEditing.emit(null);
        this.setupComponent.emit();
    }

    private determineFormState(): void {
        getIdFromUri(this.activatedRoute, this.routeIdentifier())
            .subscribe((id: string) => {
                this.uriId.set(id);

                this.setFormState(
                    this.uriId()
                        ? NgtFormState.EDITING
                        : NgtFormState.CREATING
                );
            });
    }

    private async bindDisabledStateByAbilityValidation(): Promise<void> {
        if (this.isDisabled() === undefined && this.abilityValidationService) {
            const hasPermission = await this.abilityValidationService.hasManagePermission();

            if (!hasPermission) {
                this.isDisabledByAbilityValidation.set(true);
            }
        }
    }

    private destroySubscriptions(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }
}
