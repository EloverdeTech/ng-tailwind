import { Component, EventEmitter, Host, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { Observable } from 'rxjs';

import { isValidNgForm } from '../../helpers/form/form';
import { getIdFromUri } from '../../helpers/routing/route';
import { NgtHttpFormService } from '../../services/http/ngt-http-form.service';

@Component({
  selector: 'ngt-form',
  templateUrl: './ngt-form.component.html',
  styleUrls: ['./ngt-form.component.css']
})
export class NgtFormComponent implements OnInit {
  @Input() guessFormState: boolean = true;
  @Input() message: string = 'Preencha corretamente todos os campos';
  @Input() routeIdentifier: string = 'id';
  @Input() resource: any;
  @Input() customLayout: boolean = false;

  @Output() onCreating: EventEmitter<any> = new EventEmitter;
  @Output() onEditing: EventEmitter<any> = new EventEmitter;
  @Output() onLoadingChange: EventEmitter<any> = new EventEmitter;
  @Output() onShiningChange: EventEmitter<any> = new EventEmitter;
  @Output() setupComponent: EventEmitter<any> = new EventEmitter;

  public formState: NgtFormState;
  public uriId: any;

  private loading = false;
  private shining = false;

  constructor(
    @Optional() @Host()
    public formContainer: ControlContainer,
    @Optional() @Host()
    public ngForm: NgForm,
    public router: Router,
    public route: ActivatedRoute,
    public cachedRouteReuseStrategy: RouteReuseStrategy,
    @Inject('NgtFormService')
    public ngtHttpFormService: NgtHttpFormService
  ) { }

  ngOnInit() {
    if (this.guessFormState) {
      this.determineFormState().subscribe(() => {
        this.setupComponent.emit();
      });

      return;
    }

    this.setupComponent.emit();
  }

  determineFormState() {
    return Observable.create((observer) => {
      getIdFromUri(this.route, this.routeIdentifier).subscribe((id) => {
        this.uriId = id;

        if (this.uriId) {
          this.setFormState(NgtFormState.EDITING);
        } else {
          this.setFormState(NgtFormState.CREATING);
        }

        observer.next();
      });
    });
  }

  isCreating() {
    return this.formState === NgtFormState.CREATING;
  }

  isEditing() {
    return this.formState === NgtFormState.EDITING;
  }

  isLoading() {
    return this.loading;
  }

  isShining() {
    return this.shining;
  }

  canShowValidationMessage() {
    return this.formContainer &&
      this.formContainer['submitted'] &&
      this.formContainer.status != 'VALID' &&
      this.formContainer.status != 'DISABLED';
  }

  setShining(shining: boolean) {
    this.shining = shining;
    this.onShiningChange.emit(this.shining);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.onLoadingChange.emit(this.loading);
  }

  setFormState(state: NgtFormState, triggerChange: boolean = true) {
    this.formState = state;

    if (triggerChange) {
      this.triggerFormStateChange();
    }
  }

  getFormState() {
    return this.formState;
  }

  triggerFormStateChange() {
    if (this.isEditing()) {
      this.triggerFormEditing();
    } else if (this.isCreating()) {
      this.triggerFormCreating();
    }
  }

  saveResource() {
    return Observable.create((observer) => {
      if (isValidNgForm(this.ngForm)) {
        this.setLoading(true);
        this.ngtHttpFormService.saveResource(this.resource)
          .subscribe(() => {
            this.clearCachedRoute();
            this.setLoading(false);
            observer.complete();
          });
      } else {
        observer.error();
      }
    });
  }

  public clearCachedRoute() {
    (<any>this.cachedRouteReuseStrategy).clearCachedRoutes();
  }

  protected triggerFormCreating() {
    this.onCreating.emit();
  }

  protected triggerFormEditing() {
    if (this.uriId && this.resource) {
      this.setLoading(true);
      this.setShining(true);

      this.ngtHttpFormService.loadResourceById(this.resource, this.uriId)
        .subscribe(
          (resource: any) => {
            this.setLoading(false);
            this.setShining(false);
            this.onEditing.emit(resource);
          },
          (error) => {
            this.setLoading(false);
            this.setShining(false);
            console.error(error);
          }
        );

      return;
    }

    this.onEditing.emit(null);
  }
}

export enum NgtFormState {
  CREATING = 'CREATING',
  EDITING = 'EDITING'
};